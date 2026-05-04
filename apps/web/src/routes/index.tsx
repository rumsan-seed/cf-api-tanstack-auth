import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

import { getAccessToken } from '../lib/auth-client'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const navigate = useNavigate()

  useEffect(() => {
    void navigate({
      to: getAccessToken() ? '/home' : '/login',
      replace: true,
    })
  }, [navigate])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f0f0f0] px-6 text-center">
      <div className="rounded-2xl bg-white px-8 py-6 shadow-sm">
        <h1 className="text-lg font-black text-[#1a1a1a]">Loading</h1>
        <p className="mt-2 text-sm text-gray-500">
          Redirecting...
        </p>
      </div>
    </main>
  )
}
