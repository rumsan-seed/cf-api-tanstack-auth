# Assets API

## List / Search assets

```
GET /projects/:projectId/assets
```

**Query params:**

| Param | Description |
|---|---|
| `q` | Full-text search on title, fileName, altText |
| `folder` | Filter by folder path |
| `tags` | Comma-separated tags |
| `trashed` | `true` to list trashed assets only |
| `limit` | Default 100 |
| `offset` | Default 0 |

## Get asset

```
GET /projects/:projectId/assets/:assetId
```

## Upload asset

```
POST /projects/:projectId/assets/upload
Content-Type: multipart/form-data
```

**Fields:**
- `file` — the file to upload
- `title` (optional)
- `altText` (optional)
- `description` (optional)
- `folderPath` (optional)
- `tags` (optional, JSON array string)

## Ingest from URL

```
POST /projects/:projectId/assets/ingest
```

**Body:**
```json
{
  "url": "https://example.com/image.jpg",
  "title": "Optional title",
  "folderPath": "optional/folder",
  "tags": ["tag1"]
}
```

## Update asset

```
PATCH /projects/:projectId/assets/:assetId
```

**Body:** `{ "title", "altText", "description" }`

## Update tags

```
POST /projects/:projectId/assets/:assetId/tags
```

**Body:** `{ "tags": ["tag1", "tag2"] }` — replaces all tags.

## Trash asset

```
DELETE /projects/:projectId/assets/:assetId
```

Sets `trashedAt`. Does not delete from R2.

## Restore asset

```
POST /projects/:projectId/assets/:assetId/restore
```

Clears `trashedAt`.

## Empty trash

```
POST /projects/:projectId/assets/trash/empty
```

Permanently deletes all trashed assets from D1 and R2.
