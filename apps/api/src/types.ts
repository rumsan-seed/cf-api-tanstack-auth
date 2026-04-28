import type { AppDb } from './lib/db'

export interface HonoBindings {
  DB: D1Database
  RS_OFFICE_APP_ID: string
  RS_OFFICE_URL: string
  RS_OFFICE_APP_PRIVATE_KEY?: string
}

export interface HonoVariables {
  db: AppDb
  user: {
    id: string
    name: string
    email: string
    role: string
    image?: string | null
  }
}

export type HonoEnv = {
  Bindings: HonoBindings
  Variables: HonoVariables
}
