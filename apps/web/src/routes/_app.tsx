import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { clearToken, decodeToken, getAccessToken, signOut } from '../lib/auth-client'
import { useAuth } from '../providers/auth-provider'
import { AppHeader, AppShell, IconSidebar } from '../components/layout'
import { usePlugins } from '../lib/use-plugins'
import { registeredPlugins } from '../plugins/index'

export const Route = createFileRoute('/_app')({
  beforeLoad: () => {
    if (typeof window === 'undefined') return

    const token = getAccessToken()
    if (!token) throw redirect({ to: '/login', replace: true })

    if (!decodeToken(token)) {
      clearToken()
      throw redirect({ to: '/login', replace: true })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  const { user } = useAuth()
  const activePlugins = usePlugins(registeredPlugins)
  const navItems = activePlugins.map((p) => p.navItem)

  if (!user) return null

  return (
    <AppShell
      sidebar={
        <IconSidebar
          navItems={navItems}
          avatar={user.image ?? undefined}
        />
      }
    >
      <AppHeader
        user={user}
        onLogout={async () => {
          await signOut()
          window.location.assign('/login')
        }}
      />
      <Outlet />
    </AppShell>
  )
}
