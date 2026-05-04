-- Migration: 0001_initial_schema
-- Generated for Cloudflare D1 (SQLite)
-- Auth is handled by RS Office (external). User IDs are RS Office CUIDs stored as plain text.

CREATE TABLE `app_settings` (
  `key` text PRIMARY KEY NOT NULL,
  `value` text NOT NULL,
  `is_secret` integer NOT NULL DEFAULT 0,
  `updated_at` integer NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE `plugin_registry` (
  `id` text PRIMARY KEY NOT NULL,
  `label` text NOT NULL,
  `description` text NOT NULL DEFAULT '',
  `enabled` integer NOT NULL DEFAULT 1,
  `config` text NOT NULL DEFAULT '{}',
  `created_at` integer NOT NULL DEFAULT (unixepoch()),
  `updated_at` integer NOT NULL DEFAULT (unixepoch())
);
