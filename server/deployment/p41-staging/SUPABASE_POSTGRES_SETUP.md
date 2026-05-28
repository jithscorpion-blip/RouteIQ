# Supabase PostgreSQL Setup for RouteIQ

## Step 1: Create project

Create a Supabase project named `routeiq-staging`.

## Step 2: Get connection string

Use the direct PostgreSQL connection string as `DATABASE_URL` in the backend environment.

## Step 3: Run dry-run migration locally first

```bash
npm run db:migrate:dry-run
```

## Step 4: Run staging migration only when ready

```bash
ROUTEIQ_DATABASE_MODE=postgres ROUTEIQ_RUN_MIGRATIONS=true npm run db:migrate
```

## Step 5: Seed sample data only

```bash
npm run db:seed:dry-run
```

Do not load full company customer data into staging until import validation has been tested.
