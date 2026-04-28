# Setup Wizard

The setup wizard runs **once** after the first superadmin logs in. It collects your Cloudflare configuration and stores it in the `app_settings` D1 table. It cannot be re-run once completed.

## Steps

### 1. Welcome
Introduction screen. Click **Begin Setup** to continue.

### 2. Cloudflare Account
Enter your **Cloudflare Account ID** (found in the Cloudflare dashboard URL).

### 3. R2 Configuration
- **R2 Bucket Name** — the bucket that will store all assets
- **CF API Token** — needs `Workers R2 Storage:Edit` permission

### 4. Cloudflare Images (Optional)
- **CF Images Token** — enables image transformation via Cloudflare Image Resizing
- If skipped, images will be stored as-is without resizing

### 5. Review & Save
Review your settings and click **Complete Setup**.

## What Happens After Setup

- The `app_settings` table is populated with your CF credentials
- A `setupCompleted` flag is set permanently
- You are redirected to the Projects page
- The API enforces `requireSetupComplete` on all project/asset routes

## Notes

- Only the initial superadmin can complete setup (first user to log in)
- Setup cannot be re-triggered via the UI or API
- To change settings after setup, use the Admin panel (coming soon)
