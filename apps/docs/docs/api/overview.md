# API Overview

The Asset Manager API is a [Hono](https://hono.dev) Worker running on Cloudflare Workers.

## Base URL

```
https://your-worker.workers.dev
```

## Authentication

All endpoints (except `/auth/*` and `/serve/*`) require a valid Google ID token sent as a bearer token.

See [Authentication](./auth) for details.

## Response Format

Successful responses return JSON. Errors return:

```json
{ "error": "Human-readable message" }
```

## SDK

A typed client is available via the `@rs/sdk` package:

```ts
import { createApiClient } from '@rs/sdk'

const api = createApiClient('https://your-worker.workers.dev')
const projects = await api.projects.$get().then((r) => r.json())
```

## Endpoints Summary

| Group | Base Path |
|---|---|
| Auth | `/auth/*` |
| Setup | `/setup` |
| Projects | `/projects` |
| Members | `/projects/:projectId/members` |
| Presets | `/projects/:projectId/presets`, `/presets` |
| Assets | `/projects/:projectId/assets` |
| Serve | `/serve/:projectId/*` |
| Admin | `/admin/*` |
