import type { SidebarNavItem } from '../components/layout/icon-sidebar'

export interface PluginDefinition {
  id: string
  label: string
  /** Roles allowed to see this plugin. Empty/undefined = any authenticated user. */
  roles?: string[]
  navItem: SidebarNavItem
}
