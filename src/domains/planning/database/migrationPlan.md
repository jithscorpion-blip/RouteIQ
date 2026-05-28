# RouteIQ Migration Plan

## P12 scope

This is a migration setup only. No database connection is created by the frontend.

## Recommended execution order

1. Create dev database.
2. Run `001_initial_planning_schema.sql`.
3. Load sample depot, customer, vehicle, order, and route data.
4. Connect mock backend handlers to database repository layer.
5. Add production migration tooling only after the MVP API is stable.

## Recommended database

PostgreSQL is preferred because RouteIQ needs relational integrity, JSON audit payloads, time-series style telemetry, and geospatial upgrade options later.
