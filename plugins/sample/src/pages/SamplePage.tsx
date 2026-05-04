import { Activity, FlaskConical, KeyRound, ShieldCheck } from 'lucide-react'

interface HealthData {
  status: string
  timestamp: string
}

interface ExampleUser {
  sub?: string
  email?: string
  roles?: string[]
  org_unit?: string
  department?: string
  manager_cuid?: string | null
  iat?: number
  exp?: number
  [key: string]: unknown
}

interface SamplePageProps {
  userEmail?: string
  health?: HealthData | null
  healthLoading?: boolean
  healthError?: string | null
  exampleUser?: ExampleUser | null
  exampleLoading?: boolean
  exampleError?: string | null
  decodedToken?: Record<string, unknown> | null
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
      {ok ? 'Healthy' : 'Error'}
    </span>
  )
}

function DataCard({
  icon,
  iconColor,
  title,
  subtitle,
  loading,
  error,
  children,
}: {
  icon: React.ReactNode
  iconColor: string
  title: string
  subtitle: string
  loading?: boolean
  error?: string | null
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <span className={iconColor}>{icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-mono">{subtitle}</p>
        </div>
      </div>
      <div className="px-5 py-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-400" />
            Loading…
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-600">
            {error}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: unknown }) {
  const display =
    value === null || value === undefined
      ? '—'
      : typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)

  return (
    <div className="flex items-start justify-between gap-6 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 shrink-0">{label}</span>
      <span className="text-xs font-mono text-gray-800 text-right break-all">{display}</span>
    </div>
  )
}

function formatUnixTime(ts?: number) {
  if (!ts) return undefined
  return new Date(ts * 1000).toLocaleString()
}

export function SamplePage({
  health,
  healthLoading,
  healthError,
  exampleUser,
  exampleLoading,
  exampleError,
  decodedToken,
}: SamplePageProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white">
      <div className="border-b border-gray-100 px-8 pt-8 pb-6">
        <div className="flex items-center gap-2.5">
          <FlaskConical size={20} className="text-orange-500" />
          <h1 className="text-2xl font-semibold text-gray-900 pl-2">Sample Plugin</h1>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">API integration demo</p>
      </div>

      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <div className="grid gap-4 lg:grid-cols-3">
          <DataCard
            icon={<ShieldCheck size={16} />}
            iconColor="text-green-600"
            title="Health Check"
            subtitle="GET /health"
            loading={healthLoading}
            error={healthError}
          >
            {health ? (
              <div>
                <div className="mb-3">
                  <StatusBadge ok={health.status === 'ok'} />
                </div>
                <Row label="status" value={health.status} />
                <Row label="timestamp" value={health.timestamp} />
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-2">No data</p>
            )}
          </DataCard>

          <DataCard
            icon={<Activity size={16} />}
            iconColor="text-blue-500"
            title="Server JWT Payload"
            subtitle="GET /example"
            loading={exampleLoading}
            error={exampleError}
          >
            {exampleUser ? (
              <div>
                {Object.entries(exampleUser).map(([k, v]) => (
                  <Row
                    key={k}
                    label={k}
                    value={k === 'iat' || k === 'exp' ? formatUnixTime(v as number) : v}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-2">No data</p>
            )}
          </DataCard>

          <DataCard
            icon={<KeyRound size={16} />}
            iconColor="text-orange-500"
            title="Decoded Token"
            subtitle="client-side JWT"
          >
            {decodedToken ? (
              <div>
                {Object.entries(decodedToken).map(([k, v]) => (
                  <Row
                    key={k}
                    label={k}
                    value={k === 'iat' || k === 'exp' ? formatUnixTime(v as number) : v}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-2">No token available</p>
            )}
          </DataCard>
        </div>
      </div>
    </div>
  )
}
