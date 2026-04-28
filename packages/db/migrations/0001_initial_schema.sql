-- Migration: 0001_initial_schema
-- Generated for Cloudflare D1 (SQLite)
-- Auth is handled by RS Office (external). User IDs are RS Office CUIDs stored as plain text.

CREATE TABLE `app_settings` (
  `key` text PRIMARY KEY NOT NULL,
  `value` text NOT NULL,
  `is_secret` integer NOT NULL DEFAULT 0,
  `updated_at` integer NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `projects` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `website` text NOT NULL,
  `cors_origins` text NOT NULL DEFAULT '[]',
  `bucket` text NOT NULL,
  `root_path` text NOT NULL DEFAULT '',
  `asset_url` text NOT NULL,
  `output_format` text NOT NULL DEFAULT 'webp',
  `is_archived` integer NOT NULL DEFAULT 0,
  `created_by` text,
  `created_at` integer NOT NULL DEFAULT (unixepoch()),
  `updated_at` integer NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `project_members` (
  `id` text PRIMARY KEY NOT NULL,
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `user_id` text NOT NULL,
  `role` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `transformation_presets` (
  `id` text PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `suffix` text NOT NULL DEFAULT '',
  `longer_side` integer,
  `quality` integer NOT NULL DEFAULT 85,
  `output_format` text NOT NULL DEFAULT 'webp',
  `is_default` integer NOT NULL DEFAULT 1,
  `is_optional` integer NOT NULL DEFAULT 0,
  `scope` text NOT NULL DEFAULT 'global',
  `project_id` text REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `sort_order` integer NOT NULL DEFAULT 0,
  `created_at` integer NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `project_preset_overrides` (
  `id` text PRIMARY KEY NOT NULL,
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `preset_id` text NOT NULL REFERENCES `transformation_presets`(`id`) ON DELETE CASCADE,
  `is_enabled` integer NOT NULL DEFAULT 1
);

CREATE TABLE `assets` (
  `id` text PRIMARY KEY NOT NULL,
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `title` text NOT NULL,
  `folder_path` text NOT NULL DEFAULT '',
  `file_name` text NOT NULL,
  `mime_type` text NOT NULL,
  `size` integer NOT NULL DEFAULT 0,
  `width` integer,
  `height` integer,
  `is_image` integer NOT NULL DEFAULT 0,
  `is_temporary` integer NOT NULL DEFAULT 0,
  `description` text,
  `applied_presets` text NOT NULL DEFAULT '[]',
  `trashed_at` integer,
  `trashed_by` text,
  `last_accessed_at` integer,
  `created_by` text,
  `created_at` integer NOT NULL DEFAULT (unixepoch()),
  `updated_at` integer NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `asset_tags` (
  `id` text PRIMARY KEY NOT NULL,
  `asset_id` text NOT NULL REFERENCES `assets`(`id`) ON DELETE CASCADE,
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `tag` text NOT NULL
);

CREATE TABLE `project_tags` (
  `id` text PRIMARY KEY NOT NULL,
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `tag` text NOT NULL
);

CREATE TABLE `project_folders` (
  `id` text PRIMARY KEY NOT NULL,
  `project_id` text NOT NULL REFERENCES `projects`(`id`) ON DELETE CASCADE,
  `path` text NOT NULL,
  `created_at` integer NOT NULL DEFAULT (unixepoch())
);

-- Indexes
CREATE UNIQUE INDEX `project_members_project_user_idx` ON `project_members`(`project_id`, `user_id`);
CREATE UNIQUE INDEX `project_tags_unique_idx` ON `project_tags`(`project_id`, `tag`);
CREATE UNIQUE INDEX `project_folders_unique_idx` ON `project_folders`(`project_id`, `path`);
CREATE UNIQUE INDEX `project_preset_overrides_unique_idx` ON `project_preset_overrides`(`project_id`, `preset_id`);
CREATE INDEX `assets_project_idx` ON `assets`(`project_id`);
CREATE INDEX `assets_folder_idx` ON `assets`(`project_id`, `folder_path`);
CREATE INDEX `asset_tags_asset_idx` ON `asset_tags`(`asset_id`);

-- ============================================================
-- Seed: Global transformation presets
-- ============================================================

INSERT INTO `transformation_presets` (`id`, `name`, `suffix`, `longer_side`, `quality`, `output_format`, `is_default`, `is_optional`, `scope`, `sort_order`) VALUES
  ('preset_thumbnail', 'Thumbnail', '_thb', 300,  70, 'webp', 1, 0, 'global', 1),
  ('preset_default',   'Default',   '',     1200, 85, 'webp', 1, 0, 'global', 2),
  ('preset_cover',     'Cover',     '_cover', 1920, 85, 'webp', 0, 1, 'global', 3),
  ('preset_original',  'Original',  '_original', NULL, 100, 'original', 1, 0, 'global', 4);
