# Authentication

Authentication uses Google Sign-In in the web app. The web client receives a Google ID token and sends it to the API. The API verifies that token before creating or loading the local user.

## Sign In

```http
POST /auth/google
Content-Type: application/json

{
  "token": "<google-id-token>"
}
```

Returns the authenticated app user:

```json
{
  "user": {
    "id": "usr_123",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "superadmin",
    "image": "https://..."
  }
}
```

## Session Verification

Send the Google ID token on protected requests:

```http
Authorization: Bearer <google-id-token>
```

To verify the current token and fetch the current user:

```http
GET /auth/session
Authorization: Bearer <google-id-token>
```

## First User Promotion

The first authenticated user created in the local database is automatically promoted to `superadmin`.

## Sign Out

Sign out is handled in the web app by clearing the locally stored token and user state.
