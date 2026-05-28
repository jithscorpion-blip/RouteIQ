# RouteIQ Planning Database Schema Draft

Productization P8 adds a database-ready schema draft for the planning domain.

## Scope

This draft covers:

- Routes
- Route stops
- Orders
- Vehicles
- Vehicle telemetry
- ETA snapshots
- Audit events
- Supporting reference tables for depots, customers, and drivers

## Recommended database

Use PostgreSQL or Supabase Postgres for the first production backend. The schema uses UUIDs, JSONB, views, and indexes that fit PostgreSQL well.

## Key design decisions

### Routes

`planning_routes` stores one planned route for one date, depot, vehicle, and driver.

Important fields:

- `route_code`
- `route_date`
- `depot_code`
- `geo_zone_code`
- `status`
- `vehicle_id`
- `driver_id`
- capacity totals and utilization percentages
- lock/release metadata
- routing provider metadata

### Stops

`planning_route_stops` stores the sequenced customer stops for a route.

Important fields:

- `stop_number` for system sequence
- `manual_stop_number` for manual planner changes
- `sequence_source` to track whether the stop is system or manual
- planned and actual arrival/departure timestamps
- planned and actual distance/time from previous stop

### Orders

`planning_orders` stores imported sales/order demand. Orders begin as `unplanned`, then become assigned, sequenced, loaded, delivered, or failed.

### Stop orders

`planning_stop_orders` links orders to stops. This supports multiple orders for the same customer stop.

### Vehicles

`planning_vehicles` stores capacity limits for route planning:

- Weight
- CBM
- Cases
- EF units

RouteIQ currently treats Weight, CBM, and EF as hard capacity checks. Cases remain reference-only unless business rules change later.

### Telemetry

`planning_vehicle_telemetry` stores GPS pings from driver mobile app or future GPS integrations.

Do not use high-frequency GPS from day one. Start with low-frequency pings and event-based updates to control cost and data volume.

### ETA snapshots

`planning_eta_snapshots` stores calculated ETA results from Google Routes, Mapbox, OpenRouteService, or internal estimates.

This allows RouteIQ to compare planned ETA vs live ETA without recalculating expensive routing calls every screen refresh.

### Audit events

`planning_audit_events` records important user/system actions:

- route locked
- route released
- stop sequence changed
- order assigned/unassigned
- route recalculated
- driver started route
- actual ETA updated

This is important for operations control and dispute review.

## Not included yet

This is a schema draft only.

Not included:

- real backend server
- migrations runner
- authentication
- row-level security policies
- production database connection
- API endpoints
- ORM models

## Next step

P9 should add backend service boundaries and API endpoint design. Do not connect the frontend directly to the database.
