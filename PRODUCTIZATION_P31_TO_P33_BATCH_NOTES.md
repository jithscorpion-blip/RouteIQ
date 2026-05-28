# RouteIQ Productization P31-P33 Batch Notes

Completed together:

- P31: Seed data script
- P32: Backend validation layer
- P33: API error code catalog

## P31 — Seed data script

Added `server/seed/` with dry-run-first seed behavior.

Commands:

```bash
npm run db:seed:dry-run
ROUTEIQ_RUN_SEED=true npm run db:seed
```

## P32 — Backend validation layer

Added `server/validation/planningValidators.js` and connected it to key MVP endpoints:

- `POST /api/routes`
- `POST /api/routes/recalculate`
- `POST /api/orders/assign`
- `POST /api/orders/unassign`
- `POST /api/telemetry/location`

## P33 — API error code catalog

Added centralized API errors under `server/errors/apiErrors.js` and a readable catalog endpoint:

```txt
GET /api/errors
```

## Preserved

- No production auth provider added
- No paid Google Maps call enabled
- No forced PostgreSQL requirement
- Memory fallback remains safe
- Frontend behavior unchanged
