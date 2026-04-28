# Boilerplate — Google Login + RS Office Auth

A pnpm + Turborepo monorepo boilerplate with Google Sign-In wired to RS Office JWT authentication.

## What's included

- **Google login** — frontend renders the Google Identity Services button; on success the `id_token` is sent to the backend.
- **Token exchange** — `POST /auth/google` exchanges the Google `id_token` for an RS Office JWT via the `@rumsan/user-sdk`.
- **Session verification** — `GET /auth/session` verifies the JWT and returns the current user.
- **Token refresh** — `POST /auth/refresh` refreshes an expiring JWT.
- **Authenticated layout** — `/_app` verifies the stored token on mount; unauthenticated users are redirected to `/login`.
- **Home page** — a minimal placeholder at `/home` to build on.

## Prerequisites

- [Node.js](https://nodejs.org/) `^23.7.0`
- [pnpm](https://pnpm.io/) `^10.19.0`

```bash
npm install -g pnpm
```

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables for the API (`apps/api/wrangler.toml`):

| Variable                   | Description                                   |
| -------------------------- | --------------------------------------------- |
| `RS_OFFICE_URL`            | Base URL of the RS Office instance            |
| `RS_OFFICE_APP_ID`         | App ID registered in RS Office                |
| `RS_OFFICE_APP_PRIVATE_KEY`| (Optional) secp256k1 private key for challenge signing |

3. Configure the web env (`apps/web/.env`):

```
VITE_API_URL=http://localhost:8787
VITE_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```

---

## Apps

### `apps/web` — Web Frontend

React 19 + TanStack Start + Vite + TailwindCSS v4. Runs on port **7010**.

```bash
pnpm dev:web
# or
pnpm --filter @rs/web dev
```

### `apps/api` — Backend API

Hono + Cloudflare Workers. Runs locally via Wrangler on port **8787**.

```bash
pnpm dev:api
# or
pnpm --filter @rs/api dev
```

Deploy:

```bash
pnpm --filter @rs/api deploy
```

---

## Running everything together

```bash
pnpm dev
```

---

## API routes

| Method | Path             | Description                                      |
| ------ | ---------------- | ------------------------------------------------ |
| POST   | `/auth/google`   | Exchange Google `id_token` for an RS Office JWT  |
| GET    | `/auth/session`  | Verify JWT and return current user               |
| POST   | `/auth/refresh`  | Refresh an expiring JWT                          |
| GET    | `/health`        | Health check                                     |

---

## Packages

| Package              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `packages/db`        | Drizzle ORM schema + D1 client factory           |
| `packages/sdk`       | Typed Hono client (`hc`) + `createApiClient`     |
| `packages/ui`        | Shared React UI primitives                       |
| `packages/validators`| Zod schemas                                      |

---

## Other commands

| Command           | Description              |
| ----------------- | ------------------------ |
| `pnpm lint`       | Lint all packages        |
| `pnpm lint:fix`   | Lint and auto-fix        |
| `pnpm format`     | Check formatting         |
| `pnpm format:fix` | Fix formatting           |
| `pnpm typecheck`  | Type-check all packages  |
| `pnpm clean`      | Remove build artifacts   |
