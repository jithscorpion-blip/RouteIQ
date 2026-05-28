# RouteIQ Planning Backend Boundary

This folder documents the planned backend/service boundary for RouteIQ planning.

Current status:
- Frontend prototype exists.
- Database schema draft exists.
- Backend proxy contract for route recalculation exists.
- No production backend is implemented yet.

Purpose of this layer:
- Keep paid routing provider keys on the server.
- Persist route plans, stops, assignments, telemetry, and audit events.
- Provide controlled APIs for planners, drivers, and admin users.
- Keep frontend workflow independent from the final backend technology.

Recommended first backend stack for MVP:
- Node.js / Express or serverless API routes
- PostgreSQL / Supabase / Neon for database
- Google Routes API called only from backend
- Object storage later for import/export files if required

Hard rule:
Do not call Google Routes API directly from the browser in production.
