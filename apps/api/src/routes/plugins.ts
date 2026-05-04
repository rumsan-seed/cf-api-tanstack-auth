import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { pluginRegistry } from '@rs/db'

import type { HonoEnv } from '../types'
import { requireAuth, requireSuperAdmin } from '../middleware/auth'

export const pluginsRouter = new Hono<HonoEnv>()

// ── Seed helper — ensures default plugin rows exist ──────────────────────────

const DEFAULT_PLUGINS: Array<{
  id: string
  label: string
  description: string
  enabled: boolean
  config: Record<string, string>
}> = [
  {
    id: 'sample',
    label: 'Sample Plugin',
    description: 'Example plugin to demonstrate the plugin system',
    enabled: true,
    config: {},
  },
]

async function seedPlugins(db: HonoEnv['Variables']['db']) {
  for (const plugin of DEFAULT_PLUGINS) {
    const existing = await db
      .select()
      .from(pluginRegistry)
      .where(eq(pluginRegistry.id, plugin.id))
      .get()
    if (!existing) {
      await db.insert(pluginRegistry).values(plugin)
    }
  }
}

// ── GET /plugins — list all plugins (any authenticated user) ─────────────────

pluginsRouter.get('/', requireAuth, async (c) => {
  const db = c.var.db
  await seedPlugins(db)
  const plugins = await db.select().from(pluginRegistry).all()
  return c.json({ plugins })
})

// ── GET /plugins/:id/config — get a single plugin's config ───────────────────

pluginsRouter.get('/:id/config', requireAuth, async (c) => {
  const db = c.var.db
  await seedPlugins(db)
  const id = c.req.param('id')
  const row = await db
    .select()
    .from(pluginRegistry)
    .where(eq(pluginRegistry.id, id))
    .get()
  if (!row) return c.json({ error: 'Plugin not found' }, 404)
  return c.json({ id: row.id, config: row.config, enabled: row.enabled })
})

// ── PUT /plugins/:id — update plugin enabled state and/or config (superadmin) ─

pluginsRouter.put('/:id', requireAuth, requireSuperAdmin, async (c) => {
  const db = c.var.db
  const id = c.req.param('id')
  const body = await c.req.json<{
    enabled?: boolean
    config?: Record<string, string>
  }>()

  const existing = await db
    .select()
    .from(pluginRegistry)
    .where(eq(pluginRegistry.id, id))
    .get()

  if (!existing) return c.json({ error: 'Plugin not found' }, 404)

  const updated = await db
    .update(pluginRegistry)
    .set({
      ...(body.enabled !== undefined ? { enabled: body.enabled } : {}),
      ...(body.config !== undefined ? { config: body.config } : {}),
      updatedAt: new Date(),
    })
    .where(eq(pluginRegistry.id, id))
    .returning()

  return c.json({ plugin: updated[0] })
})
