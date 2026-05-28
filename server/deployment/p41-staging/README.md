# RouteIQ P41 Staging Deployment Package

This package prepares RouteIQ for a safe staging deployment before any real pilot.

## Recommended staging stack

- Frontend: Vercel, Netlify, or Render static site
- Backend: Render or Railway Node.js service
- Database: Supabase PostgreSQL, Neon PostgreSQL, Railway PostgreSQL, or Render PostgreSQL
- Routing: mock provider first; Google Routes disabled by default
- GPS: polling-only foundation first; no WebSocket requirement for MVP staging

## Golden rule

Staging should prove the full flow without paid routing or live GPS device dependency:

Frontend -> Backend API -> Memory/PostgreSQL adapter -> Mock routing -> Demo auth

Only after this passes should PostgreSQL, Google Routes, and pilot GPS be enabled one at a time.
