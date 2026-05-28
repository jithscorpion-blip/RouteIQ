# P41 — RouteIQ Staging Deployment Package

## Completed

This step prepares RouteIQ for staging deployment after the P37–P40 MVP hardening phase.

## Added

- Staging deployment guide
- Render backend setup guide
- Railway backend setup guide
- Supabase/PostgreSQL setup guide
- Staging environment variable checklist
- Staging smoke-test checklist
- Frontend staging setup guide
- First pilot data loading guide
- Small sample CSV pilot data pack
- Local Windows setup fixes from actual RouteIQ run

## Important fixes included

- Removed sandbox `package-lock.json` to prevent internal registry timeout on local machines.
- Pinned Tailwind/PostCSS/Autoprefixer to stable v3-compatible versions.
- Added `tailwind.config.js`.
- Kept Google Routes disabled by default.
- Kept staging database optional; memory mode remains safe first run.

## Recommended next step

P42: Create first pilot data import workflow and staging smoke-test runner.
