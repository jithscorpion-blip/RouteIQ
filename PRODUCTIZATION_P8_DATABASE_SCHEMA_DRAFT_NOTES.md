# Productization P8 — Database Schema Draft

## Completed

Added database schema draft for the RouteIQ planning domain.

## Added files

```txt
src/domains/planning/database/
├── routeiq-planning-schema.sql
├── README.md
├── relationships.md
└── index.ts
```

## Schema coverage

```txt
planning_depots
planning_customers
planning_drivers
planning_vehicles
planning_orders
planning_routes
planning_route_stops
planning_stop_orders
planning_vehicle_telemetry
planning_eta_snapshots
planning_audit_events
planning_route_summary_vw
```

## Design intent

This schema supports:

- route planning
- stop sequencing
- unplanned order assignment
- driver route release
- actual vs planned monitoring
- telemetry/GPS tracking
- ETA variance tracking
- audit control

## Preserved

```txt
No backend server added
No database connection added
No API endpoint implementation added
No frontend workflow behavior change
No production migration executed
```

## Next recommended step

P9: Add backend service boundary design and API endpoint list.

Do not connect the browser directly to the database. Use a backend/API layer for validation, audit, routing-provider calls, and persistence.
