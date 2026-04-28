import { RsOfficeClient, signChallenge, verifyJwt } from '@rumsan/user-sdk'

export interface RsOfficeUser {
  cuid: string
  name: string
  email: string
  active: boolean
  pending_approval: boolean
  org_unit?: string
  job_title?: string
  department?: string
  employment_type?: string
  created_at: string
}

export interface RsOfficeGoogleAuthResult {
  token: string
  user: RsOfficeUser
  roles: string[]
  google: {
    sub: string
    given_name?: string
    family_name?: string
    picture?: string
  }
}

export interface RsOfficeTokenPayload {
  sub: string
  app: string
  roles: string[]
  email: string
  org_unit?: string
  department?: string
  manager_cuid?: string
  iat: number
  exp: number
}

let cachedPublicKey: { baseUrl: string; publicKey: string } | null = null

function getClient(baseUrl: string): RsOfficeClient {
  return new RsOfficeClient({ baseUrl })
}

async function getPublicKey(baseUrl: string): Promise<string> {
  if (cachedPublicKey?.baseUrl === baseUrl) return cachedPublicKey.publicKey

  const { publicKey } = await getClient(baseUrl).auth.getPublicKey()
  cachedPublicKey = { baseUrl, publicKey }
  return publicKey
}

/**
 * Exchange a Google id_token for an RS Office JWT.
 * When `privateKeyHex` is provided the app fetches a challenge, signs it with
 * secp256k1, and includes `challenge` + `app_signature` in the request body.
 * Throws an error with `.status` set to the HTTP status on failure.
 */
export async function googleLogin(
  idToken: string,
  appId: string,
  baseUrl: string,
  privateKeyHex?: string,
): Promise<RsOfficeGoogleAuthResult> {
  const client = getClient(baseUrl)
  const data: { id_token: string; challenge?: string; app_signature?: string } = { id_token: idToken }

  if (privateKeyHex) {
    const { challenge } = await client.auth.getChallenge({ appId })
    data.challenge = challenge
    data.app_signature = signChallenge(challenge, privateKeyHex)
  }

  return client.auth.googleLogin(data, { appId }) as Promise<RsOfficeGoogleAuthResult>
}

/**
 * Refresh an RS Office JWT. Returns the new token string.
 * Throws with `.status = 401` if the session has expired.
 */
export async function refreshToken(
  token: string,
  baseUrl: string,
): Promise<string> {
  try {
    const result = await getClient(baseUrl).auth.refreshToken({ token })
    return result.token
  } catch {
    const err = new Error('Session expired') as Error & { status: number }
    err.status = 401
    throw err
  }
}

/**
 * Verify an RS Office JWT using the server public key.
 * Returns the decoded payload on success, or null if the token is invalid or expired.
 */
export async function verifyToken(
  token: string,
  baseUrl: string,
): Promise<RsOfficeTokenPayload | null> {
  try {
    const publicKey = await getPublicKey(baseUrl)
    const result = await verifyJwt(token, publicKey)
    return result.valid ? (result.payload as RsOfficeTokenPayload) : null
  } catch {
    return null
  }
}
