import { useQuery } from '@tanstack/react-query'
import { API_URL } from './api'
import { getAccessToken, useSession } from './auth-client'
import type { PluginDefinition } from './plugin-types'

interface PluginRegistryRow {
  id: string
  enabled: boolean
  config: Record<string, string>
}

async function fetchPlugins(): Promise<PluginRegistryRow[]> {
  try {
    const token = getAccessToken()
    const res = await fetch(`${API_URL}/plugins`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) return []
    const data = (await res.json()) as { plugins: PluginRegistryRow[] }
    return data.plugins
  } catch {
    return []
  }
}

/**
 * Returns the subset of `registered` plugins that are:
 * 1. Enabled in the DB plugin_registry
 * 2. Allowed for the current user's role
 */
export function usePlugins(registered: PluginDefinition[]) {
  const session = useSession()
  const userRoles = session.data?.user.roles ?? []

  const { data: dbPlugins = [] } = useQuery({
    queryKey: ['plugins'],
    queryFn: fetchPlugins,
    staleTime: 5 * 60 * 1000,
    enabled: !!session.data,
  })

  const enabledIds = new Set(
    dbPlugins.filter((p) => p.enabled).map((p) => p.id),
  )

  return registered.filter((plugin) => {
    if (!enabledIds.has(plugin.id)) return false
    if (plugin.roles && plugin.roles.length > 0) {
      return plugin.roles.some((r) => userRoles.includes(r))
    }
    return true
  })
}

/** Returns config for a single plugin from the DB, or {} if not found. */
export function usePluginConfig(pluginId: string): Record<string, string> {
  const session = useSession()

  const { data: dbPlugins = [] } = useQuery({
    queryKey: ['plugins'],
    queryFn: fetchPlugins,
    staleTime: 5 * 60 * 1000,
    enabled: !!session.data,
  })

  return dbPlugins.find((p) => p.id === pluginId)?.config ?? {}
}

/** Returns enabled status and config for a single plugin. */
export function usePlugin(pluginId: string): { enabled: boolean; config: Record<string, string> } {
  const session = useSession()

  const { data: dbPlugins = [] } = useQuery({
    queryKey: ['plugins'],
    queryFn: fetchPlugins,
    staleTime: 5 * 60 * 1000,
    enabled: !!session.data,
  })

  const plugin = dbPlugins.find((p) => p.id === pluginId)
  return { enabled: plugin?.enabled ?? false, config: plugin?.config ?? {} }
}
