# Members & Roles

## Site Roles

| Role | Description |
|---|---|
| `superadmin` | Full access to all projects, users, and admin settings |
| `user` | Default role — access only to projects they are members of |

The first user to log in is automatically promoted to `superadmin`. Additional superadmins can be granted in **Admin → Users**.

## Project Roles

| Role | Permissions |
|---|---|
| `admin` | Full project access including settings and member management |
| `editor` | Can upload, update, and delete assets |
| `readOnly` | Can view and browse assets only |

**Superadmins bypass all project role checks** — they have full access to every project regardless of membership.

## Adding Members

Project admins and superadmins can add members in **Project Settings → Members**:

1. Enter the member's email address
2. Select a role
3. Click **Add**

The user must already have an account (must have logged in at least once).

## Changing Roles

Roles can be changed inline in the Members list. Only `admin` or `superadmin` users can change roles.

## Removing Members

Click the trash icon next to a member to remove them. Removed members lose access immediately.
