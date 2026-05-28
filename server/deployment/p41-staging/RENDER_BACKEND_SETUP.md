# Render Backend Setup

## Service type

Create a Render Web Service from the RouteIQ repo.

## Build command

```bash
npm install --registry=https://registry.npmjs.org/
```

## Start command

```bash
npm run server:start
```

## Health check

```txt
/api/health
```

## Minimum environment variables

```env
NODE_ENV=staging
PORT=8787
ROUTEIQ_DATABASE_MODE=memory
ROUTEIQ_AUTH_MODE=demo
ROUTEIQ_ROUTING_PROVIDER=mock
ROUTEIQ_GOOGLE_ROUTES_ENABLED=false
ROUTEIQ_ENABLE_LIVE_GOOGLE_ROUTES=false
ROUTEIQ_CORS_ORIGIN=https://YOUR_FRONTEND_STAGING_URL
```

## First verification

Open:

```txt
https://YOUR_BACKEND_URL/api/health
```

Expected response includes:

```json
{"ok":true}
```
