# RouteIQ Staging Environment Variables

## Backend required variables

```env
NODE_ENV=staging
PORT=8787
ROUTEIQ_DATABASE_MODE=memory
ROUTEIQ_AUTH_MODE=demo
ROUTEIQ_ROUTING_PROVIDER=mock
ROUTEIQ_GOOGLE_ROUTES_ENABLED=false
ROUTEIQ_ENABLE_LIVE_GOOGLE_ROUTES=false
ROUTEIQ_CORS_ORIGIN=http://localhost:5173
```

## Backend PostgreSQL mode variables

Use only after memory-mode staging passes.

```env
ROUTEIQ_DATABASE_MODE=postgres
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/routeiq_staging
ROUTEIQ_RUN_MIGRATIONS=false
```

## Google Routes variables

Use only after cache, quotas, and cost controls are verified.

```env
ROUTEIQ_ROUTING_PROVIDER=google
ROUTEIQ_GOOGLE_ROUTES_ENABLED=true
ROUTEIQ_ENABLE_LIVE_GOOGLE_ROUTES=false
GOOGLE_MAPS_API_KEY=server_side_key_only
```

Never expose `GOOGLE_MAPS_API_KEY` in frontend code.
