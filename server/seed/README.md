# RouteIQ Seed Data

This folder provides controlled seed data for local/staging setup.

Scripts:

```bash
npm run db:seed:dry-run
ROUTEIQ_RUN_SEED=true npm run db:seed
```

Safety:

- Dry-run is default.
- Seed execution requires `ROUTEIQ_RUN_SEED=true`.
- Memory fallback can be seeded locally.
- PostgreSQL seed inserts routes and telemetry through repositories; full order insert support can be expanded after final table mapping is locked.
