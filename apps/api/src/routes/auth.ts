import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

import type { HonoEnv } from '../types'
import { getBearerToken } from '../lib/auth'
import * as rsOffice from '../lib/rs-office'

export const authRouter = new Hono<HonoEnv>()

const googleAuthSchema = z.object({
  token: z.string().min(1),
})

authRouter.post('/google', zValidator('json', googleAuthSchema), async (c) => {
  const { token: idToken } = c.req.valid('json')

  let result: rsOffice.RsOfficeGoogleAuthResult
  try {
    result = await rsOffice.googleLogin(
      idToken,
      c.env.RS_OFFICE_APP_ID,
      c.env.RS_OFFICE_URL,
      c.env.RS_OFFICE_APP_PRIVATE_KEY,
    )
  } catch (e) {
    console.error('POST /auth/google error:', e)
    const err = e as { status?: number; message?: string }
    return c.json(
      { error: err.message ?? 'Authentication failed' },
      ((err.status ?? 500) as 400 | 401 | 403 | 404 | 500),
    )
  }

  const user = {
    id: result.user.cuid,
    name: result.user.name,
    email: result.user.email,
    role: result.roles[0] ?? 'user',
    image: result.google.picture ?? null,
  }

  return c.json({ token: result.token, user })
})

authRouter.get('/session', async (c) => {
  const token = getBearerToken(c.req.raw.headers)
  if (!token) return c.json({ error: 'Unauthorized' }, 401)

  const payload = await rsOffice.verifyToken(token, c.env.RS_OFFICE_URL)
  if (!payload) return c.json({ error: 'Unauthorized' }, 401)

  // RS Office JWT contains sub, email, roles — but not name or image.
  // The frontend merges this with stored display data (name/image set at sign-in).
  return c.json({
    user: {
      id: payload.sub,
      email: payload.email,
      role: payload.roles[0] ?? 'user',
    },
  })
})

authRouter.post('/refresh', async (c) => {
  const token = getBearerToken(c.req.raw.headers)
  if (!token) return c.json({ error: 'Unauthorized' }, 401)

  try {
    const newToken = await rsOffice.refreshToken(token, c.env.RS_OFFICE_URL)
    return c.json({ token: newToken })
  } catch {
    return c.json({ error: 'Session expired' }, 401)
  }
})
