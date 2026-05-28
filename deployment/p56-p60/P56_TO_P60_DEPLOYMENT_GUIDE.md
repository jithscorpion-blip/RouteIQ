# RouteIQ P56–P60 Deployment Guide

Current target stack:

```txt
Frontend: Vercel Free
Backend: Render Free
Database: Supabase Free
Repository: GitHub
```

## P56 — Push to GitHub

1. Extract this package.
2. Open the extracted folder in Cursor/VS Code.
3. Run locally:

```bash
npm install
npm run build
npm run server:dev
```

4. Create a new GitHub repository, for example `routeiq-staging`.
5. Push the folder to GitHub.

## P57 — Create Supabase database

1. Create Supabase project `routeiq-staging`.
2. Copy the PostgreSQL connection string.
3. Run migrations from local terminal using the instructions in `supabase/README.md`.

## P58 — Deploy backend to Render

1. Render → New → Web Service.
2. Connect the GitHub repository.
3. Runtime: Node.
4. Build command:

```bash
npm install
```

5. Start command:

```bash
npm run server:start
```

6. Health check path:

```txt
/api/health
```

7. Add environment variables:

```txt
NODE_ENV=production
ROUTEIQ_DATABASE_MODE=postgres
ROUTEIQ_DATABASE_SSL=require
DATABASE_URL=<Supabase connection string>
ROUTEIQ_CORS_ORIGIN=<your Vercel URL after frontend deploy>
ROUTEIQ_ENABLE_LIVE_GOOGLE_ROUTES=false
ROUTING_PROVIDER=mock
```

Also set strong secret values:

```txt
ROUTEIQ_AUTH_SECRET=<long random secret>
ROUTEIQ_DEMO_ADMIN_TOKEN=<long random token>
```

Render also provides `PORT`; RouteIQ now reads it automatically.

## P59 — Deploy frontend to Vercel

1. Vercel → Add New Project.
2. Import the same GitHub repository.
3. Framework preset: Vite.
4. Build command:

```bash
npm run build
```

5. Output directory:

```txt
dist
```

6. Environment variables:

```txt
VITE_ROUTEIQ_API_MODE=backend
VITE_ROUTEIQ_API_BASE=<your Render backend URL>
VITE_ROUTEIQ_API_BASE_URL=<your Render backend URL>
```

Redeploy after adding variables.

## P60 — Hosted smoke test

From local terminal:

```bash
ROUTEIQ_BACKEND_URL="https://your-render-service.onrender.com" ROUTEIQ_FRONTEND_URL="https://your-vercel-site.vercel.app" npm run staging:hosted-smoke
```

Windows PowerShell:

```powershell
$env:ROUTEIQ_BACKEND_URL="https://your-render-service.onrender.com"
$env:ROUTEIQ_FRONTEND_URL="https://your-vercel-site.vercel.app"
npm run staging:hosted-smoke
```

Expected result:

```txt
✓ Backend health ok
✓ Demo users ok
✓ Demo login ok
✓ Import schema ok
✓ Import history ok
✓ Frontend URL reachable
Hosted staging smoke test passed.
```

## Important free-tier note

Render Free may sleep after inactivity. First request can take time. This is acceptable for staging/demo, not ideal for production.
