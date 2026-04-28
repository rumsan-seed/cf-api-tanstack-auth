import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import {
  getAccessToken,
  setUser,
  signOut,
  useSession,
  clearToken,
} from '../lib/auth-client'
import { API_URL } from '../lib/api'
import { AppShell, IconSidebar } from '../components/layout'
import type { AuthUser } from '../lib/auth-client'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const navigate = useNavigate()
  const session = useSession()
  const [checking, setChecking] = useState(!session.data)

  useEffect(() => {
    if (session.data) {
      setChecking(false)
      return
    }

    const token = getAccessToken()
    if (!token) {
      void navigate({ to: '/login', replace: true })
      return
    }

    fetch(`${API_URL}/auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          clearToken()
          void navigate({ to: '/login', replace: true })
          return
        }
        const { user } = (await res.json()) as { user: AuthUser }
        setUser(user)
        setChecking(false)
      })
      .catch(() => {
        clearToken()
        void navigate({ to: '/login', replace: true })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentUser = session.data?.user

  if (checking) return null

  return (
    <AppShell
      sidebar={
        <IconSidebar
          navItems={[]}
          avatar={currentUser?.image ?? undefined}
          onSignOut={async () => {
            await signOut()
            window.location.assign('/login')
          }}
        />
      }
    >
      <Outlet />
    </AppShell>
  )
}
