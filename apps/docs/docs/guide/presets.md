# Image Presets

Presets define how images are transformed at upload time. There are two types:

## Global Presets

Created by superadmins in **Admin → Global Presets**. Applied to all projects by default. The four built-in presets are:

| Name | Suffix | Width | Quality | Notes |
|---|---|---|---|---|
| Thumbnail | `_thb` | 300px | 70% | Always created |
| Default | *(none)* | 1200px | 85% | Always created |
| Cover | `_cover` | 1920px | 85% | Optional |
| Original | `_original` | — | — | Always stored |

## Project Presets

Created in **Project Settings → Presets**. Scoped to a single project. Project admins can:
- Create custom presets
- Enable/disable any preset (global or project-level)

## Preset Options

| Field | Description |
|---|---|
| **Name** | Human-readable label |
| **Suffix** | File suffix, e.g. `_thb`. Empty string = default variant |
| **Width** | Output width in pixels |
| **Height** | Output height in pixels |
| **Quality** | 1–100 compression quality |
| **Fit** | `cover`, `contain`, `fill`, `inside`, `outside` |

## How Transforms Work

1. File is uploaded to the Worker
2. The original is stored in R2 as `{id}_original.{ext}`
3. For each enabled preset, the Worker fetches the original via the internal `/internal/transform` endpoint using Cloudflare Image Resizing (`cf.image` options)
4. The transformed buffer is stored in R2 as `{id}{suffix}.webp` (or the project's output format)
5. A metadata JSON file `{id}_meta.json` is also written to R2

> **Note:** Image Resizing requires the Cloudflare Images add-on. Without it, only the original is stored.
