# RouteIQ Staging Deployment Config

This folder documents the safe staging setup before production release.

## Recommended staging stack

- Frontend: Vite static build on Vercel / Netlify / Cloudflare Pages
- Backend: Node.js server on Railway / Render / Fly.io
- Database: PostgreSQL on Supabase / Neon / Railway Postgres
- Routing provider: disabled by default; mock mode first
- Telemetry: HTTP polling first; WebSocket later

## Staging principles

1. Use separate staging database.
2. Use restricted API keys only.
3. Keep Google Routes disabled until cost controls are verified.
4. Run migrations in dry-run first.
5. Seed only anonymized route/customer/order test data.
6. Enable logs, but do not log exact customer coordinates in plain text.

## Minimum staging environment variables

```txt
NODE_ENV=staging
PORT=8787
ROUTEIQ_DATABASE_MODE=postgres
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB
ROUTEIQ_RUN_MIGRATIONS=false
ROUTEIQ_AUTH_MODE=header-dev
ROUTEIQ_ROUTING_PROVIDER=mock
ROUTEIQ_GOOGLE_ROUTES_ENABLED=false
```

## Promotion rule

Only move to production when:

- Frontend build passes
- Backend health check passes
- DB migration dry-run passes
- Permission checks pass
- Google route recalculation remains server-side only
- Driver telemetry ingestion test passes
