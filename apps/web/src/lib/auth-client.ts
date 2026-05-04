import { useSyncExternalStore } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  roles: string[]
  image?: string | null
}

interface AuthSession {
  user: AuthUser
}

interface AuthSessionResponse {
  data: AuthSession | null
}

// ---------------------------------------------------------------------------
// Token storage — localStorage
// ---------------------------------------------------------------------------

const TOKEN_KEY = 'rs.asset-mgmt.token'

export function saveToken(token: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function clearToken() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}

/**
 * Returns the stored app JWT. Safe to call during SSR (returns null).
 */
export function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

// ---------------------------------------------------------------------------
// JWT decode — client-side only, no signature verification
// ---------------------------------------------------------------------------

interface JwtPayload {
  exp?: number
  id?: string
  sub?: string
  name?: string
  email?: string
  /** Singular form — not used by RS Office but kept for compat */
  role?: string
  /** RS Office JWT uses an array */
  roles?: string[]
  image?: string | null
  [key: string]: unknown
}

/**
 * Decodes a JWT and returns an AuthUser, or null if the token is
 * malformed or expired. Does NOT verify the signature — that is the
 * server's responsibility. Used only to extract user fields and check
 * the expiry time on the client.
 */
export function decodeToken(token: string): AuthUser | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    // Base64-url → base64 → JSON
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    const payload = JSON.parse(json) as JwtPayload

    // Reject expired tokens
    if (payload.exp !== undefined && payload.exp * 1000 < Date.now()) {
      return null
    }

    const id = payload.id ?? payload.sub
    if (!id || !payload.email) return null

    const roles = Array.isArray(payload.roles)
      ? payload.roles.map(String)
      : payload.role
        ? [String(payload.role)]
        : ['user']
    const role = roles[0] ?? 'user'

    return {
      id: String(id),
      name: payload.name ?? payload.email,
      email: payload.email,
      role,
      roles,
      image: payload.image ?? null,
    }
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// In-memory auth state
//
// Pre-populated synchronously from localStorage when the module first loads
// on the client. This means `useSession()` already has the user on the very
// first render after a page refresh — no async gap, no timing races.
// ---------------------------------------------------------------------------

function loadFromStorage(): AuthSessionResponse {
  // On the server localStorage doesn't exist — start empty.
  if (typeof localStorage === 'undefined') return { data: null }

  const token = getAccessToken()
  if (!token) return { data: null }

  const user = decodeToken(token)
  if (!user) return { data: null }

  return { data: { user } }
}

let currentSnapshot: AuthSessionResponse = loadFromStorage()
const SERVER_SNAPSHOT: AuthSessionResponse = { data: null }

const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Populate the in-memory user. Called after login or when the app boots
 * and finds an existing token in localStorage.
 */
export function setUser(user: AuthUser | null) {
  currentSnapshot = user ? { data: { user } } : { data: null }
  emitChange()
}

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

export function useSession(): AuthSessionResponse {
  return useSyncExternalStore(
    subscribe,
    () => currentSnapshot,
    // SSR snapshot: must be stable reference to avoid infinite loop
    () => SERVER_SNAPSHOT,
  )
}

// ---------------------------------------------------------------------------
// signOut — clears token from localStorage and in-memory state
// ---------------------------------------------------------------------------

export async function signOut() {
  clearToken()
  setUser(null)
}

// ---------------------------------------------------------------------------
// Legacy compat shim
// ---------------------------------------------------------------------------

export const authClient = {
  useSession,
  signOut,
}

export { useSession as default }
