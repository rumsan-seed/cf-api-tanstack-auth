import { useSyncExternalStore } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
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
// In-memory auth state
// ---------------------------------------------------------------------------

let currentSnapshot: AuthSessionResponse = { data: null }

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
    () => currentSnapshot,
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
