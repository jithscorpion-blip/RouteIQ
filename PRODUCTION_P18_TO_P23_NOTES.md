# RouteIQ P18-P23 Production Wiring Notes

## Scope completed

P18 Converted mock backend idea into endpoint skeletons under `/server`.
P19 Added auth token verification, RouteIQ roles, and permission checks.
P20 Added database adapter boundary with memory fallback and DATABASE_URL readiness.
P21 Added Node HTTP backend server skeleton.
P22 Added server-side routing provider foundation for mock/Google routing.
P23 Added GPS telemetry ingestion and query skeleton.

## How to run frontend

```bash
npm install
npm run build
npm run dev
```

## How to run backend skeleton

```bash
cp .env.example .env
npm run server:dev
```

Development auth header:

```txt
Authorization: Bearer dev-admin-token
```

## Current endpoint examples

- GET /api/health
- GET /api/routes
- POST /api/routes
- POST /api/routes/:routeId/lock
- POST /api/routes/recalculate
- GET /api/orders
- POST /api/orders/assign
- POST /api/telemetry/location
- GET /api/telemetry?routeId=ROUTE_ID

## Still intentionally not done

- No production auth provider such as Auth0/Supabase Auth/Clerk yet
- No live PostgreSQL pool dependency yet
- No Google Routes paid API call enabled yet
- No WebSocket live tracking yet
- No deployment secrets configured yet

## Recommended next step

P24: Add production database adapter using PostgreSQL Pool + migration runner script.
