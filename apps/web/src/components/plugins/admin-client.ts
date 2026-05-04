export interface PluginRow {
  id: string
  label: string
  description: string
  enabled: boolean
  config: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface AdminClientOptions {
  apiUrl: string
  getToken: () => string | null
}

async function request<T>(
  opts: AdminClientOptions,
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = opts.getToken()
  const res = await fetch(`${opts.apiUrl}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!res.ok) {
    const body = (await res
      .json()
      .catch(() => ({ error: res.statusText }))) as { error?: string }
    throw new Error(body.error ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export function createAdminClient(opts: AdminClientOptions) {
  return {
    listPlugins() {
      return request<{ plugins: PluginRow[] }>(opts, '/plugins')
    },
    updatePlugin(
      id: string,
      patch: { enabled?: boolean; config?: Record<string, string> },
    ) {
      return request<{ plugin: PluginRow }>(opts, `/plugins/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
    },
  }
}

export type AdminClient = ReturnType<typeof createAdminClient>
