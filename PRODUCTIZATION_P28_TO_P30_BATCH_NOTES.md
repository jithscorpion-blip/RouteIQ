# RouteIQ Productization P28–P30 Batch Notes

## Completed

- P28: Repository layer for routes, orders, telemetry, and audit events
- P29: Services connected to repository boundary
- P30: Staging deployment config

## Repository layer

Added server/repositories:

- routeRepository.js
- orderRepository.js
- telemetryRepository.js
- auditRepository.js
- index.js

The repository layer supports both modes:

- memory-fallback mode for safe local development
- PostgreSQL mode when ROUTEIQ_DATABASE_MODE=postgres and DATABASE_URL are configured

## Service layer update

Services now call repositories instead of directly mutating memory state.

This prepares RouteIQ for real database wiring while preserving safe local behavior.

## Added endpoint

- POST /api/orders/unassign

## Staging deployment config

Added:

- server/deployment/staging/STAGING_DEPLOYMENT.md
- server/deployment/staging/render.yaml
- server/deployment/staging/railway.json

## Safety

- No production database forced
- No paid Google Maps call enabled
- Memory fallback remains safe default
- Build passed
- Backend health check passed
