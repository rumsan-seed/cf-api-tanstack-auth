import * as React from 'react'

import { createAdminClient } from './admin-client'
import { PluginList } from './PluginList'

interface AdminPluginsPageProps {
  apiUrl: string
  getToken: () => string | null
}

export function AdminPluginsPage({ apiUrl, getToken }: AdminPluginsPageProps) {
  const client = React.useMemo(
    () => createAdminClient({ apiUrl, getToken }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiUrl],
  )

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-white">
      <div className="border-b border-gray-100 px-8 pt-8 pb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Plugins</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Enable or disable plugins and configure their settings.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <PluginList client={client} />
      </div>
    </div>
  )
}
