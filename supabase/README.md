# RouteIQ Supabase Setup — P56 to P60

Use Supabase Free for the first RouteIQ staging database.

## 1. Create project

1. Open Supabase.
2. Create a new project, for example `routeiq-staging`.
3. Choose a strong database password and save it securely.
4. Wait until the project is ready.

## 2. Get connection string

In Supabase:

```txt
Project Settings → Database → Connection string → URI
```

Use the pooled or direct URI. For Render, the pooled URI is usually safer on free tiers.

Set this in Render as:

```txt
DATABASE_URL=<your Supabase PostgreSQL URI>
ROUTEIQ_DATABASE_MODE=postgres
ROUTEIQ_DATABASE_SSL=require
```

## 3. Run migration

Recommended first run from your local terminal:

```bash
ROUTEIQ_DATABASE_MODE=postgres ROUTEIQ_DATABASE_SSL=require ROUTEIQ_RUN_MIGRATIONS=true DATABASE_URL="<SUPABASE_DB_URI>" npm run db:migrate
```

On Windows PowerShell:

```powershell
$env:ROUTEIQ_DATABASE_MODE="postgres"
$env:ROUTEIQ_DATABASE_SSL="require"
$env:ROUTEIQ_RUN_MIGRATIONS="true"
$env:DATABASE_URL="<SUPABASE_DB_URI>"
npm run db:migrate
```

## 4. Keep this safe

Do not paste the database password into frontend/Vercel variables. Only Render/backend needs `DATABASE_URL`.
