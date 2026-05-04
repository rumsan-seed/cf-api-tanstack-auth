import { FlaskConical } from 'lucide-react'
import type { PluginDefinition } from '../../lib/plugin-types'

export const samplePlugin: PluginDefinition = {
  id: 'sample',
  label: 'Sample Plugin',
  navItem: {
    icon: <FlaskConical size={18} />,
    to: '/sample-plugin',
  },
}
