import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { SamplePage } from '@rs/plugin-sample'

import { decodeToken, getAccessToken } from '../../../lib/auth-client'

export const Route = createFileRoute('/_app/sample-plugin/')({
  component: SamplePluginRoute,
})

const EXAMPLE_API_URL = import.meta.env.VITE_EXAMPLE_API_URL ?? 'http://0.0.0.0:9000'

async function fetchHealth() {
  const res = await fetch(`${EXAMPLE_API_URL}/health`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<{ status: string; timestamp: string }>
}

async function fetchExample(token: string) {
  const res = await fetch(`${EXAMPLE_API_URL}/example`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const data = (await res.json()) as { user: Record<string, unknown> }
  return data.user
}

function SamplePluginRoute() {
  const token = getAccessToken()
  const decodedToken = token ? decodeToken(token) : null

  const {
    data: health,
    isLoading: healthLoading,
    error: healthErr,
  } = useQuery({
    queryKey: ['example-api', 'health'],
    queryFn: fetchHealth,
    staleTime: 30_000,
    retry: 1,
  })

  const {
    data: exampleUser,
    isLoading: exampleLoading,
    error: exampleErr,
  } = useQuery({
    queryKey: ['example-api', 'example', token],
    queryFn: () => fetchExample(token!),
    staleTime: 60_000,
    retry: 1,
    enabled: !!token,
  })

  return (
    <SamplePage
      health={health ?? null}
      healthLoading={healthLoading}
      healthError={healthErr ? (healthErr as Error).message : null}
      exampleUser={exampleUser ?? null}
      exampleLoading={exampleLoading}
      exampleError={exampleErr ? (exampleErr as Error).message : null}
      decodedToken={decodedToken as Record<string, unknown> | null}
    />
  )
}
