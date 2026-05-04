import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { getDb } from './lib/db'
import { authRouter } from './routes/auth'
import { pluginsRouter } from './routes/plugins'
import type { HonoEnv } from './types'

const app = new Hono<HonoEnv>()

// ── Global middleware ─────────────────────────────────────────────────────────

app.use('*', logger())

app.use('*', cors({
  origin: (origin) => origin,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// Inject db into context
app.use('*', async (c, next) => {
  c.set('db', getDb(c.env.DB))
  await next()
})

// ── Routes ────────────────────────────────────────────────────────────────────

app.route('/auth', authRouter)
app.route('/plugins', pluginsRouter)

// ── Health check ──────────────────────────────────────────────────────────────

app.get('/health', (c) => c.json({ ok: true, ts: Date.now() }))

// Export app type for SDK
export type AppType = typeof app

export default app
