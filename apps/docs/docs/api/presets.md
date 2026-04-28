# Presets API

## Global presets

### List

```
GET /presets
```

### Create (superadmin only)

```
POST /presets
```

**Body:**
```json
{
  "name": "Thumbnail",
  "suffix": "_thb",
  "width": 300,
  "quality": 70,
  "fit": "cover"
}
```

### Toggle enabled

```
POST /presets/:presetId/toggle
```

**Body:** `{ "enabled": true }`

### Delete

```
DELETE /presets/:presetId
```

## Project presets

### List (includes global presets)

```
GET /projects/:projectId/presets
```

### Create

```
POST /projects/:projectId/presets
```

Same body as global presets.

### Toggle enabled

```
POST /projects/:projectId/presets/:presetId/toggle
```

### Delete

```
DELETE /projects/:projectId/presets/:presetId
```
