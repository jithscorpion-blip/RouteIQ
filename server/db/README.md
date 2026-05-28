# RouteIQ Server Database Layer

This folder contains the production database boundary for RouteIQ.

## Modes

### Memory fallback

Default mode for local prototype safety.

```bash
npm run server:dev
```

No real database is used.

### PostgreSQL mode

Use this when connecting RouteIQ to a real database.

```bash
ROUTEIQ_DATABASE_MODE=postgres \
DATABASE_URL="postgresql://user:password@host:5432/routeiq" \
npm run server:dev
```

The PostgreSQL adapter uses the optional `pg` package. Install it before real production DB use:

```bash
npm install pg
```

## Migrations

Dry-run only:

```bash
npm run db:migrate:dry-run
```

Execute migrations:

```bash
ROUTEIQ_DATABASE_MODE=postgres \
DATABASE_URL="postgresql://user:password@host:5432/routeiq" \
ROUTEIQ_RUN_MIGRATIONS=true \
npm run db:migrate
```

## Safety rules

- Never run migrations directly on production before testing in development.
- Always back up production data before schema changes.
- Keep API DTOs aligned with schema changes.
- Keep Google Maps keys server-side only.
