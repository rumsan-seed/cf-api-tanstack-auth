import * as React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, ChevronDown, Puzzle, XCircle } from 'lucide-react'

import type { AdminClient, PluginRow } from './admin-client'

interface PluginListProps {
  client: AdminClient
}

export function PluginList({ client }: PluginListProps) {
  const qc = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'plugins'],
    queryFn: () => client.listPlugins(),
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string
      patch: { enabled?: boolean; config?: Record<string, string> }
    }) => client.updatePlugin(id, patch),
    onSuccess: () =>
      void qc.invalidateQueries({ queryKey: ['admin', 'plugins'] }),
  })

  if (isLoading)
    return <div className="p-4 text-sm text-gray-400">Loading…</div>
  if (error)
    return (
      <div className="p-4 text-sm text-red-500">{(error as Error).message}</div>
    )

  const plugins = data?.plugins ?? []

  return (
    <div className="flex w-full flex-col gap-2">
      {plugins.map((plugin) => (
        <PluginCard
          key={plugin.id}
          plugin={plugin}
          onToggle={(enabled) =>
            void updateMutation.mutate({ id: plugin.id, patch: { enabled } })
          }
          onSaveConfig={(config) =>
            void updateMutation.mutate({ id: plugin.id, patch: { config } })
          }
        />
      ))}
    </div>
  )
}

interface PluginCardProps {
  plugin: PluginRow
  onToggle: (enabled: boolean) => void
  onSaveConfig: (config: Record<string, string>) => void
}

function PluginCard({ plugin, onToggle, onSaveConfig }: PluginCardProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [config, setConfig] = React.useState<Record<string, string>>(plugin.config)
  const [dirty, setDirty] = React.useState(false)

  React.useEffect(() => {
    setConfig(plugin.config)
    setDirty(false)
  }, [plugin.config])

  const configKeys = Object.keys(plugin.config)
  const hasConfig = configKeys.length > 0

  function handleConfigChange(key: string, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  function handleSave() {
    onSaveConfig(config)
    setDirty(false)
  }

  function handleCancel() {
    setConfig(plugin.config)
    setDirty(false)
    setExpanded(false)
  }

  return (
    <div className="w-full bg-gray-50 rounded-2xl overflow-hidden">
      {/* Main row */}
      <div className="flex items-center gap-4 px-6 py-5">
        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Puzzle size={18} className="text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-medium text-gray-900">{plugin.label}</span>
            <span
              className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                plugin.enabled
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {plugin.enabled ? (
                <CheckCircle2 size={10} />
              ) : (
                <XCircle size={10} />
              )}
              {plugin.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {plugin.description && (
            <p className="text-xs text-gray-400 truncate">{plugin.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {hasConfig && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white transition-colors"
              title="Plugin settings"
            >
              <ChevronDown
                size={16}
                className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
              />
            </button>
          )}

          {/* Toggle switch */}
          <button
            onClick={() => onToggle(!plugin.enabled)}
            className="flex-shrink-0 cursor-pointer rounded-full transition-colors"
            style={{
              width: '44px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
              border: '2px solid var(--color-brand-500)',
              backgroundColor: plugin.enabled ? 'var(--color-brand-500)' : 'var(--color-brand-100)',
            }}
            role="switch"
            aria-checked={plugin.enabled}
            aria-label={plugin.enabled ? 'Disable plugin' : 'Enable plugin'}
          >
            <span
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: 'transform 0.2s',
                transform: plugin.enabled ? 'translateX(20px)' : 'translateX(0)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
          </button>
        </div>
      </div>

      {/* Expandable config section */}
      {hasConfig && expanded && (
        <div className="px-5 pb-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-3 mb-3">
            Plugin Settings
          </p>
          <div className="flex flex-col gap-2">
            {configKeys.map((key) => (
              <div key={key} className="flex items-center gap-3">
                <label className="w-28 flex-shrink-0 text-xs font-medium text-gray-500 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  value={config[key] ?? ''}
                  onChange={(e) => handleConfigChange(key, e.target.value)}
                  placeholder={`Enter ${key}`}
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 font-mono text-xs outline-none focus:border-orange-400 transition-colors"
                />
              </div>
            ))}
          </div>
          {dirty && (
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
