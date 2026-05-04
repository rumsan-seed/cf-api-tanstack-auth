import { createContext, useCallback, useContext, type ReactNode } from 'react'

import {
  decodeToken,
  getAccessToken,
  saveToken,
  setUser,
  signOut,
  useSession,
  type AuthUser,
} from '../lib/auth-client'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const user = session.data?.user ?? null

  const login = useCallback((newToken: string) => {
    saveToken(newToken)
    setUser(decodeToken(newToken))
  }, [])

  const logout = useCallback(() => {
    void signOut()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user ? getAccessToken() : null,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
