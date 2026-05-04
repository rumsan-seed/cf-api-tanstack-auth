import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const pluginRegistry = sqliteTable('plugin_registry', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  description: text('description').notNull().default(''),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  config: text('config', { mode: 'json' })
    .$type<Record<string, string>>()
    .notNull()
    .default({}),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
})

export type PluginRegistryRow = typeof pluginRegistry.$inferSelect
export type NewPluginRegistryRow = typeof pluginRegistry.$inferInsert
