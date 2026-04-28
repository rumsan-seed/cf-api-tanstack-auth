# Projects

Projects are the top-level organizational unit. Each project maps to a root path prefix within the shared R2 bucket.

## Creating a Project

Only **superadmins** can create projects. Navigate to **Projects → New Project** and fill in:

| Field | Description |
|---|---|
| **Name** | Display name for the project |
| **Website** | Primary URL — automatically added to CORS |
| **R2 Bucket** | The R2 bucket name (from app settings) |
| **Root Path** | Optional prefix, e.g. `my-site/` |
| **Asset URL Prefix** | Base URL where assets are served, e.g. `https://assets.example.com` |
| **Default Image Format** | Output format for transformed images (WebP recommended) |
| **Additional CORS Origins** | Extra allowed origins beyond the website URL |

## R2 CORS

When you create or update a project's `website` or `corsOrigins`, the API automatically updates the R2 bucket CORS policy via the Cloudflare REST API. The website and all cors origins are merged into the allowed origins list.

## Archiving

Archived projects are hidden from all members. Only superadmins can archive/unarchive via **Settings → General → Danger Zone**.

## Folders

Assets can be organized into free-form folder paths (e.g. `blog/2024`). Folders are derived from asset paths and tracked in `project_folders`. There is no need to create folders explicitly.
