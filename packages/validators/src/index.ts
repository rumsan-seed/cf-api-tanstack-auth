import { z } from 'zod'

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

export const setupSchema = z.object({
  cfAccountId: z.string().min(1, 'Cloudflare Account ID is required'),
  cfApiToken: z.string().min(1, 'Cloudflare API Token is required'),
  r2BucketName: z.string().min(1, 'R2 Bucket name is required'),
})

export type SetupInput = z.infer<typeof setupSchema>

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  website: z.url('Must be a valid URL'),
  corsOrigins: z.array(z.url()).default([]),
  bucket: z.string().min(1, 'Bucket is required'),
  rootPath: z.string().default(''),
  assetUrl: z.url('Must be a valid URL').optional().or(z.literal('')),
  outputFormat: z.enum(['webp', 'jpeg', 'png', 'avif']).default('webp'),
})

export const updateProjectSchema = createProjectSchema.partial()

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

// ---------------------------------------------------------------------------
// Project members
// ---------------------------------------------------------------------------

export const addMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['admin', 'editor', 'readOnly']),
})

export const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'editor', 'readOnly']),
})

export type AddMemberInput = z.infer<typeof addMemberSchema>
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>

// ---------------------------------------------------------------------------
// Transformation presets
// ---------------------------------------------------------------------------

export const createPresetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  suffix: z.string().default(''),
  longerSide: z.number().int().positive().optional(),
  quality: z.number().int().min(1).max(100).default(85),
  outputFormat: z.enum(['webp', 'jpeg', 'png', 'avif', 'original']).default('webp'),
  isDefault: z.boolean().default(true),
  isOptional: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
})

export const updatePresetSchema = createPresetSchema.partial()

export type CreatePresetInput = z.infer<typeof createPresetSchema>
export type UpdatePresetInput = z.infer<typeof updatePresetSchema>

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

export const uploadAssetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  folderPath: z.string().default(''),
  isTemporary: z.boolean().default(false),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  // IDs of optional presets to apply in addition to defaults
  enabledOptionalPresets: z.array(z.string()).default([]),
})

export const ingestUrlSchema = uploadAssetSchema.extend({
  url: z.url('Must be a valid URL'),
})

export const updateAssetSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  folderPath: z.string().optional(),
  isTemporary: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export const searchAssetsSchema = z.object({
  q: z.string().optional(),
  folder: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  trashed: z.coerce.boolean().default(false),
})

export type UploadAssetInput = z.infer<typeof uploadAssetSchema>
export type IngestUrlInput = z.infer<typeof ingestUrlSchema>
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>
export type SearchAssetsInput = z.infer<typeof searchAssetsSchema>
