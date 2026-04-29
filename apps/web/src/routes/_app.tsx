import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import {
  clearToken,
  getAccessToken,
  signOut,
  useSession,
} from '../lib/auth-client'
import { AppShell, IconSidebar } from '../components/layout'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const navigate = useNavigate()
  const session = useSession()

  useEffect(() => {
    // The in-memory store is pre-populated from localStorage at module load
    // time (see auth-client.ts → loadFromStorage). If session.data is still
    // null here it means there is genuinely no valid token — redirect.
    if (session.data) return

    const token = getAccessToken()
    if (!token) {
      void navigate({ to: '/login', replace: true })
      return
    }

    // Token exists but decodeToken failed (expired / malformed) — clear it.
    clearToken()
    void navigate({ to: '/login', replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const currentUser = session.data?.user

  // While the session hasn't been confirmed yet (SSR hydration moment),
  // render nothing to avoid a flash of unauthenticated content.
  if (!session.data) return null

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
