# RouteIQ Planning Database Relationships

## Main relationships

```txt
planning_depots
  └── planning_routes.depot_code
  └── planning_vehicles.depot_code
  └── planning_customers.depot_code
  └── planning_drivers.depot_code

planning_vehicles
  └── planning_routes.vehicle_id
  └── planning_vehicle_telemetry.vehicle_id

planning_drivers
  └── planning_routes.driver_id
  └── planning_vehicle_telemetry.driver_id

planning_customers
  └── planning_orders.customer_id
  └── planning_route_stops.customer_id

planning_routes
  └── planning_route_stops.route_id
  └── planning_vehicle_telemetry.route_id
  └── planning_eta_snapshots.route_id
  └── planning_audit_events.route_id

planning_route_stops
  └── planning_stop_orders.stop_id
  └── planning_eta_snapshots.stop_id
  └── planning_audit_events.stop_id

planning_orders
  └── planning_stop_orders.order_id
  └── planning_audit_events.order_id
```

## Operational flow

```txt
1. Import customers, vehicles, drivers, and orders.
2. Orders start as unplanned.
3. Planner creates routes for date + depot.
4. Orders are assigned to route stops.
5. Stops are sequenced by system or manually adjusted.
6. Route is locked after capacity and sequence validation.
7. Route is released to driver.
8. Driver mobile app sends progress and GPS telemetry.
9. ETA snapshots record planned vs actual changes.
10. Audit events track all major actions.
```
