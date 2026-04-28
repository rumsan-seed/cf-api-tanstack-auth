# Assets

## Uploading

Navigate to a project's asset browser and click **Upload**. You can:

- **Drag and drop** files onto the drop zone
- **Browse** for files
- **Ingest from URL** — paste an image URL and the API fetches and stores it

### Upload Options

- **Folder path** — place the asset in a folder (e.g. `blog/2024`)
- **Tags** — add searchable tags
- **Alt text** — for image accessibility
- **Description** — freeform text

## Image Transforms

When an image is uploaded, the API runs **eager transforms** using all enabled presets for the project. Each preset produces a separate file in R2:

| Variant | Suffix | Example |
|---|---|---|
| Thumbnail | `_thb` | `{id}_thb.webp` |
| Default | *(none)* | `{id}.webp` |
| Cover | `_cover` | `{id}_cover.webp` |
| Original | `_original` | `{id}_original.jpg` |

The original file is always stored unchanged.

## Serving

Assets are served via the `/serve/:projectId/:key` endpoint. On each serve:
- The file is streamed from R2
- `lastAccessedAt` is updated on the asset record
- The metadata file (`{id}_meta.json`) is updated in R2

## Asset URL Pattern

```
{assetUrl}/{folderPath?}/{id}{suffix}.{ext}
```

Example: `https://assets.example.com/blog/2024/abc123_thb.webp`

## Trash

Deleting an asset moves it to trash (`trashedAt` is set). Trashed assets:
- Are excluded from normal listings
- Can be restored from **Settings → Trash**
- Are permanently deleted when **Empty Trash** is used

## Tags & Folders

- Tags are stored in `asset_tags` and indexed for fast filtering
- Folder paths are free-form strings tracked in `project_folders`
- Filter by tag or folder in the asset browser sidebar
