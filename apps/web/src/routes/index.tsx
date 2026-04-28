import { createFileRoute, redirect } from '@tanstack/react-router'

import { getAccessToken } from '../lib/auth-client'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (!getAccessToken()) throw redirect({ to: '/login' })
    throw redirect({ to: '/home' })
  },
  component: () => null,
})
