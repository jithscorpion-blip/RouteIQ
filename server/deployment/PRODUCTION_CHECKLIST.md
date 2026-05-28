# RouteIQ Production Deployment Checklist

## Before deployment

- Create PostgreSQL database.
- Install optional backend dependency: `npm install pg`.
- Set `ROUTEIQ_DATABASE_MODE=postgres`.
- Set `DATABASE_URL` as a secret, not in source code.
- Set `ROUTEIQ_AUTH_SECRET` as a long random value.
- Restrict `GOOGLE_MAPS_API_KEY` to server usage and required APIs only.
- Set `ROUTEIQ_CORS_ORIGIN` to the production frontend URL.

## Migration sequence

1. Run `npm run db:migrate:dry-run`.
2. Run migrations in development database.
3. Validate API health.
4. Run migrations in staging.
5. Back up production.
6. Run production migration.

## Smoke tests

- `GET /api/health`
- `GET /api/routes`
- `GET /api/orders`
- `POST /api/routes/recalculate` with mock provider first
- `POST /api/telemetry/location`

## Go-live rule

Do not enable paid Google Routes calls until route caching, API key restrictions, and request throttling are verified.
