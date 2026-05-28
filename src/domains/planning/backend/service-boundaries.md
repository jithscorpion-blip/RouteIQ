# RouteIQ Service Boundary Design

## 1. Planning Service
Owns route plans, route status, planned capacity, depot filtering, lock/release, and planner-side actions.

Responsibilities:
- Create and update route plans
- Lock or release a route
- Store planned route totals
- Store route-level cost estimates
- Enforce role permissions for planner actions

Tables:
- planning_routes
- planning_route_stops
- planning_stop_orders
- planning_audit_events

## 2. Order Assignment Service
Owns assignment of imported orders to route stops or route plans.

Responsibilities:
- Assign unplanned orders to a route
- Unassign orders
- Prevent duplicate active assignment
- Maintain audit trail of assignment changes

Tables:
- planning_orders
- planning_stop_orders
- planning_audit_events

## 3. Stop Sequencing Service
Owns route stop order and sequence changes.

Responsibilities:
- Save system sequence
- Save manual sequence
- Record who changed sequence and when
- Compare system vs manual sequence for audit

Tables:
- planning_route_stops
- planning_audit_events

## 4. Routing Provider Service
Owns external map/routing provider calls.

Responsibilities:
- Receive route recalculation requests from frontend
- Build provider-specific request payload
- Call Google Routes / fallback provider from server only
- Cache route result by route fingerprint
- Return neutral RouteIQ route result to frontend

Tables:
- planning_routes
- planning_eta_snapshots
- planning_audit_events

External providers:
- Google Routes API as primary paid provider
- Mapbox / OpenRouteService as fallback options

## 5. Driver Workflow Service
Owns driver-side execution status.

Responsibilities:
- Start route
- Arrive at stop
- Complete stop
- Mark failed delivery with reason
- End route

Tables:
- planning_routes
- planning_route_stops
- planning_orders
- planning_audit_events

## 6. Telemetry Service
Owns vehicle/device location updates and ETA snapshots.

Responsibilities:
- Receive GPS pings
- Store vehicle location history
- Compute planned vs actual variance inputs
- Store ETA snapshots periodically or on meaningful events

Tables:
- planning_vehicle_telemetry
- planning_eta_snapshots
- planning_audit_events

## 7. Import Service
Owns controlled ingestion of customer, order, vehicle, and route data.

Responsibilities:
- Validate import templates
- Normalize data
- Reject bad rows with reasons
- Stage or commit imported records

Tables:
- planning_customers
- planning_orders
- planning_vehicles
- planning_drivers
- planning_routes
