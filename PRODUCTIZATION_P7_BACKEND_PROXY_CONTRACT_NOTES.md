# RouteIQ Productization P7 — Backend Proxy Contract

## Scope

Added a safe backend proxy contract for route recalculation.

## Endpoint contract

`POST /api/routes/recalculate`

The browser should call only this RouteIQ endpoint. The backend/serverless layer should then call Google Routes, Mapbox, or OpenRouteService.

## Why this matters

- Map provider API keys must stay server-side.
- Paid route calculations should be controlled and cached.
- The frontend should not call Google Routes directly.
- Provider switching becomes easier because the frontend has one stable RouteIQ contract.

## Added files

- `src/domains/planning/api/routeRecalculateContract.ts`
- `src/domains/planning/api/routingApiClient.ts`
- `src/domains/planning/api/mockRouteRecalculateHandler.ts`
- `src/domains/planning/api/index.ts`

## Still not added

- No real backend server
- No production database
- No real Google API request
- No API key
- No live traffic billing call

## Next recommended step

P8: Add database schema draft for routes, stops, orders, vehicles, telemetry, and audit events.
