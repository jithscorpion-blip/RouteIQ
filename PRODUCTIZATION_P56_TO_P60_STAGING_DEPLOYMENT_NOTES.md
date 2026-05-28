# RouteIQ P56–P60 — Staging Deployment + Database Activation

## Completed in this package

- Added `vercel.json` for Vercel Free frontend deployment.
- Added `render.yaml` for Render Free backend deployment.
- Updated backend to read Render's `PORT` environment variable.
- Added root backend response `/` for service checks.
- Added CORS origin control through `ROUTEIQ_CORS_ORIGIN`.
- Added `pg` dependency for PostgreSQL/Supabase mode.
- Added hosted staging smoke-test script.
- Added Supabase setup guide.
- Added P56–P60 deployment guide.
- Added package scripts for hosted smoke test and DB migration helpers.

## Current target

Move RouteIQ from local MVP package to hosted staging:

```txt
Vercel frontend → Render backend → Supabase PostgreSQL
```

## Still not enabled by default

- Real Google routing
- Live GPS device feed
- Production authentication
- Multi-tenant SaaS isolation
- Billing/subscription

These should stay pending until staging is stable.
