import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAccessToken } from '../lib/auth-client'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Skip redirect on the server — localStorage is not available during SSR.
    // The client-side _app.tsx useEffect is the single source of auth truth.
    if (typeof window === 'undefined') return
    if (!getAccessToken()) throw redirect({ to: '/login' })
    throw redirect({ to: '/home' })
  },
  component: () => null,
})
