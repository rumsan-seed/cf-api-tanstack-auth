# Projects API

## List projects

```
GET /projects
```

Returns projects the authenticated user is a member of (or all projects for superadmins). Each project includes the user's `memberRole`.

## Get project

```
GET /projects/:projectId
```

## Create project

```
POST /projects
```

**Body:**
```json
{
  "name": "My Site",
  "website": "https://example.com",
  "corsOrigins": ["https://staging.example.com"],
  "bucket": "my-bucket",
  "rootPath": "my-site/",
  "assetUrl": "https://assets.example.com",
  "outputFormat": "webp"
}
```

Requires `superadmin`.

## Update project

```
PATCH /projects/:projectId
```

Same body shape as create. Triggers CORS re-sync if `website` or `corsOrigins` change.

Requires project `admin` or `superadmin`.

## Archive / Unarchive

```
POST /projects/:projectId/archive
POST /projects/:projectId/unarchive
```

Requires `superadmin`.

## Folders

```
GET /projects/:projectId/folders
```

Returns a list of unique folder path strings.

## Tags

```
GET /projects/:projectId/tags
```

Returns a list of unique tag strings.
