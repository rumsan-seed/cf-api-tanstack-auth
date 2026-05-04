import type { PluginDefinition } from '../lib/plugin-types'
import { samplePlugin } from './sample'

// Register plugins here. Each plugin needs a matching route under routes/_app/.
// Restrict access by setting roles: ['admin'] on the definition.

export const registeredPlugins: PluginDefinition[] = [
  samplePlugin,
]
