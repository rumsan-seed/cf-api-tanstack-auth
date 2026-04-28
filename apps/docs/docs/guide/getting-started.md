# Getting Started

## Prerequisites

- A Cloudflare account with R2 enabled
- Node.js 20+ and pnpm 9+
- A Google OAuth Web application (Client ID)

## Installation

```bash
git clone https://github.com/rumsan/app-asset-mgmt
cd app-asset-mgmt
pnpm install
```

## Configuration

Copy `.env.example` to `.env` and fill in:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Web app URL
VITE_APP_URL=http://localhost:3000
VITE_API_URL=http://localhost:8787
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Development

Run all apps in parallel with Turborepo:

```bash
pnpm dev
```

Or run individually:

```bash
# API (Cloudflare Worker via Wrangler)
pnpm --filter @rs/api dev

# Web (TanStack Start)
pnpm --filter @rs/web dev

# Docs (VitePress)
pnpm --filter @rs/docs dev
```

## First Login

1. Open `http://localhost:3000`
2. Click **Sign in with Google**
3. The first user to log in is automatically promoted to **superadmin**
4. You will be redirected to the **Setup Wizard**

## Next Steps

- [Complete the Setup Wizard](./setup)
- [Create your first Project](./projects)
- [Upload Assets](./assets)
