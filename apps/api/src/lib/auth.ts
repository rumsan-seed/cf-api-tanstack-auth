import { verifyToken } from './rs-office'

export interface AuthenticatedUser {
  id: string
  name: string
  email: string
  role: string
  image?: string | null
}

export function getBearerToken(headers: Headers): string | null {
  const authorization = headers.get('authorization')
  if (!authorization) return null

  const [scheme, token] = authorization.split(' ')
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null

  return token
}

/**
 * Verify an RS Office JWT and map its claims to the app's AuthenticatedUser shape.
 * `role` is taken from the first element of the `roles` claim.
 * `name` falls back to the email address because the RS Office JWT has no name claim.
 */
export async function verifyAppToken(
  token: string,
  rsOfficeUrl: string,
): Promise<AuthenticatedUser | null> {
  const payload = await verifyToken(token, rsOfficeUrl)
  if (!payload) return null

  return {
    id: payload.sub,
    name: payload.email,
    email: payload.email,
    role: payload.roles[0] ?? 'user',
    image: null,
  }
}
