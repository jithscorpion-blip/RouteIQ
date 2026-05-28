# RouteIQ Deployment / Security Checklist

## Environment variables

- `ROUTEIQ_API_BASE_URL`
- `ROUTEIQ_DATABASE_URL`
- `ROUTEIQ_GOOGLE_ROUTES_API_KEY` server-side only
- `ROUTEIQ_MAPBOX_TOKEN` server-side only if enabled
- `ROUTEIQ_AUTH_SECRET`

## Security rules

- Never expose paid map provider API keys in frontend bundles.
- Restrict API keys by service and environment.
- Add role checks for Planner, Admin, Viewer, Driver, Warehouse.
- Add audit events for lock, release, resequence, assign, unassign, export, and driver exceptions.
- Rate-limit route recalculation and telemetry endpoints.

## Deployment readiness

- Build passes locally.
- Database migrations tested in dev.
- Mock backend replaced by real handlers gradually.
- Import preview validates required columns before commit.
- Routing proxy cache is enabled before live paid routing calls.
