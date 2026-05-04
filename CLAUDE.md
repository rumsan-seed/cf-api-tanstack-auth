# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

### Project Information

### Api Reference Documents and Project Directories
If you need the infomation about the api, read the api reference document:

```
example-api
../cf-api-seed-auth/docs/api.md
project directory ../cf-api-seed-auth/
```

When the feature needs to update api, update the api code and the api reference document at the same time. The api reference document should be updated in a way that it can be used by other developers to understand the api and use it without looking at the code.

## Commands

### Root (all apps)
```bash
pnpm dev          # Run all apps concurrently
pnpm dev:web      # Frontend only (port 7010)
pnpm dev:api      # API only (port 7011 via Wrangler)
```

### Web app (`apps/web`)
```bash
pnpm dev          # Vite dev server on port 7010
pnpm build        # Vite production build
```

### API (`apps/api`)
```bash
pnpm dev          # Wrangler local server on port 7011
pnpm deploy       # Deploy to Cloudflare Workers
```

## Architecture

This is a **pnpm + Turborepo monorepo** with four workspace groups:

```
apps/       – runnable applications (web, api, docs)
packages/   – shared libraries (db, sdk, ui, validators)
plugins/    – feature plugins (admin, gdrive)
tooling/    – shared dev config (eslint, prettier, typescript, tailwind)
```

### Key Tech Versions

- React 19, TanStack Start/Router/Query 1.132.x
- Vite 7, TypeScript 5.9, TailwindCSS v4
- Hono 4.7, Drizzle ORM 0.44, Zod 4
- Node ≥ 23.7, pnpm ≥ 10.19

### Must Haves
When deleting any thing always have a confirmation popup from user. Confirmation popup should be better looking (not browser default).
