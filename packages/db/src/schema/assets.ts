import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { projects } from "./projects";

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------

export const assets = sqliteTable("assets", {
  // cuid2 generated at upload time
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  // Folder path relative to rootPath e.g. "marketing/banners"
  folderPath: text("folder_path").notNull().default(""),
  // Original file name (for display; actual R2 key uses id)
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull().default(0),
  width: integer("width"),
  height: integer("height"),
  isImage: integer("is_image", { mode: "boolean" }).notNull().default(false),
  isTemporary: integer("is_temporary", { mode: "boolean" })
    .notNull()
    .default(false),
  description: text("description"),
  // JSON: list of transformation preset IDs applied at upload
  appliedPresets: text("applied_presets", { mode: "json" })
    .$type<string[]>()
    .notNull()
    .default(sql`'[]'`),
  trashedAt: integer("trashed_at", { mode: "timestamp" }),
  trashedBy: text("trashed_by"),
  lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }),
  createdBy: text("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// ---------------------------------------------------------------------------
// Asset tags (per asset)
// ---------------------------------------------------------------------------

export const assetTags = sqliteTable("asset_tags", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});

// ---------------------------------------------------------------------------
// Project tag registry — unique tags per project for autocomplete
// ---------------------------------------------------------------------------

export const projectTags = sqliteTable("project_tags", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});

// ---------------------------------------------------------------------------
// Folder registry — unique folder paths per project for browsing
// ---------------------------------------------------------------------------

export const projectFolders = sqliteTable("project_folders", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  path: text("path").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type AssetTag = typeof assetTags.$inferSelect;
export type ProjectTag = typeof projectTags.$inferSelect;
export type ProjectFolder = typeof projectFolders.$inferSelect;

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const assetsRelations = relations(assets, ({ one, many }) => ({
  project: one(projects, {
    fields: [assets.projectId],
    references: [projects.id],
  }),
  tags: many(assetTags),
}));

export const assetTagsRelations = relations(assetTags, ({ one }) => ({
  asset: one(assets, { fields: [assetTags.assetId], references: [assets.id] }),
}));
