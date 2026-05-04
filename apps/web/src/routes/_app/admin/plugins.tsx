import { createFileRoute } from '@tanstack/react-router'
import { AdminPluginsPage } from '../../../components/plugins/AdminPluginsPage'
import { getAccessToken } from '../../../lib/auth-client'
import { API_URL } from '../../../lib/api'

export const Route = createFileRoute('/_app/admin/plugins')({
  component: AdminPluginsRoute,
})

function AdminPluginsRoute() {
  return <AdminPluginsPage apiUrl={API_URL} getToken={getAccessToken} />
}
