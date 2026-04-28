import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/schema/index.ts',
  out: './migrations',
  dialect: 'sqlite',
  // For local dev with wrangler, use:
  // driver: 'd1-http' when connecting to remote D1
})
