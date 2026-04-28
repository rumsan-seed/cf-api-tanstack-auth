import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// ---------------------------------------------------------------------------
// App settings — key/value store for setup wizard config
// ---------------------------------------------------------------------------

export const appSettings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  isSecret: integer("is_secret", { mode: "boolean" }).notNull().default(false),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website").notNull(),
  // JSON array of additional CORS origins e.g. ["https://staging.example.com"]
  corsOrigins: text("cors_origins", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  bucket: text("bucket").notNull(),
  rootPath: text("root_path").notNull().default(""),
  assetUrl: text("asset_url").notNull(),
  // Default output format for image transformations
  outputFormat: text("output_format", { enum: ["webp", "jpeg", "png", "avif"] })
    .notNull()
    .default("webp"),
  isArchived: integer("is_archived", { mode: "boolean" })
    .notNull()
    .default(false),
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ---------------------------------------------------------------------------
// Project members
// ---------------------------------------------------------------------------

export const projectMembers = sqliteTable("project_members", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  role: text("role", { enum: ["admin", "editor", "readOnly"] }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ---------------------------------------------------------------------------
// Transformation presets
// ---------------------------------------------------------------------------

export const transformationPresets = sqliteTable("transformation_presets", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // File suffix appended before extension e.g. "_thb". Empty string = default variant.
  suffix: text("suffix").notNull().default(""),
  // Resize longer side to this many pixels. NULL = no resize (original).
  longerSide: integer("longer_side"),
  quality: integer("quality").notNull().default(85),
  outputFormat: text("output_format", {
    enum: ["webp", "jpeg", "png", "avif", "original"],
  })
    .notNull()
    .default("webp"),
  isDefault: integer("is_default", { mode: "boolean" }).notNull().default(true),
  isOptional: integer("is_optional", { mode: "boolean" })
    .notNull()
    .default(false),
  // global = applies to all projects by default; project = project-specific preset
  scope: text("scope", { enum: ["global", "project"] })
    .notNull()
    .default("global"),
  projectId: text("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Per-project override: tracks which optional presets are enabled for a project
export const projectPresetOverrides = sqliteTable("project_preset_overrides", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  presetId: text("preset_id")
    .notNull()
    .references(() => transformationPresets.id, { onDelete: "cascade" }),
  isEnabled: integer("is_enabled", { mode: "boolean" }).notNull().default(true),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type TransformationPreset = typeof transformationPresets.$inferSelect;
export type NewTransformationPreset = typeof transformationPresets.$inferInsert;

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
}));
