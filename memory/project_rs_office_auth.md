---
name: RS Office Google Login integration
description: Auth uses RS Office as identity provider instead of direct Google token verification
type: project
---

RS Office (`https://rsoffice-users-api.rumsan.workers.dev`) is the identity provider. The app forwards Google id_tokens to RS Office, which returns a signed RS256 JWT.

**Key decisions:**
- `RS_OFFICE_APP_ID=tucbfuz28ejq7j6n111tdxk8` (apps_env.app_id from RS Office admin panel)
- RS Office JWT is used directly (not re-signed locally with HS256)
- No local users table — RS Office is source of truth for identity
- Role: first element of `roles[]` array from RS Office response
- RS256 JWT verified via Web Crypto API (zero extra dependencies)

**Why:** Replace the previous direct Google tokeninfo verification + D1 user sync with RS Office as a centralized identity provider that handles user approval, roles, and multi-app support.

**How to apply:** When touching auth, remember:
- Backend bindings are `RS_OFFICE_APP_ID` and `RS_OFFICE_URL` (not `GOOGLE_CLIENT_ID`/`JWT_SECRET`)
- `apps/api/src/lib/rs-office.ts` is the reusable utility — copy it to other projects
- The RS Office JWT has no `name` or `image` claim; frontend merges session response with stored user (set at sign-in time)
- `/auth/session` returns `{ id, email, role }` only; frontend preserves name/image from localStorage
