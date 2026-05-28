# RouteIQ Production Wiring Phase P18-P23

This folder documents the real production layer added after the frontend/mock MVP foundation.

## Completed in this package

- P18: Real backend endpoint skeletons converted from mock handlers
- P19: Authentication and role-permission foundation
- P20: Database connection adapter boundary
- P21: Dependency-free Node backend server skeleton
- P22: Server-side routing provider integration foundation
- P23: Telemetry/GPS ingestion endpoint foundation

## Important

The server skeleton is intentionally dependency-free. It is ready for a later upgrade to Fastify/Express + PostgreSQL `pg` pool after environment, hosting, and authentication provider decisions are finalized.
