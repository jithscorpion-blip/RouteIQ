# RouteIQ Backend API Endpoint List

Base path suggestion:

```txt
/api/planning
```

## Planning routes

```txt
GET    /api/planning/routes
GET    /api/planning/routes/:routeId
POST   /api/planning/routes
PATCH  /api/planning/routes/:routeId
POST   /api/planning/routes/:routeId/lock
POST   /api/planning/routes/:routeId/release
```

## Route stops and sequencing

```txt
GET    /api/planning/routes/:routeId/stops
PATCH  /api/planning/routes/:routeId/stops/sequence
POST   /api/planning/routes/:routeId/stops/:stopId/move-up
POST   /api/planning/routes/:routeId/stops/:stopId/move-down
```

## Orders and assignment

```txt
GET    /api/planning/orders
GET    /api/planning/orders/unplanned
POST   /api/planning/orders/:orderId/assign
POST   /api/planning/orders/:orderId/unassign
GET    /api/planning/routes/:routeId/orders
```

## Vehicle and driver master

```txt
GET    /api/planning/vehicles
GET    /api/planning/drivers
POST   /api/planning/vehicles
POST   /api/planning/drivers
PATCH  /api/planning/vehicles/:vehicleId
PATCH  /api/planning/drivers/:driverId
```

## Routing provider proxy

```txt
POST   /api/routes/recalculate
```

Purpose:
- Server-side paid route calculation
- Server-side provider key protection
- Cost control and caching

## Driver mobile workflow

```txt
GET    /api/driver/routes/today
GET    /api/driver/routes/:routeId
POST   /api/driver/routes/:routeId/start
POST   /api/driver/routes/:routeId/stops/:stopId/arrive
POST   /api/driver/routes/:routeId/stops/:stopId/complete
POST   /api/driver/routes/:routeId/stops/:stopId/fail
POST   /api/driver/routes/:routeId/end
```

## Telemetry and ETA

```txt
POST   /api/telemetry/location
GET    /api/planning/routes/:routeId/telemetry/latest
GET    /api/planning/routes/:routeId/eta-snapshots
POST   /api/planning/routes/:routeId/eta-snapshots
```

## Import/export

```txt
POST   /api/planning/import/customers
POST   /api/planning/import/orders
POST   /api/planning/import/routes
POST   /api/planning/import/vehicles
GET    /api/planning/routes/:routeId/export/driver-stop-list
GET    /api/planning/routes/:routeId/export/warehouse-pick-list
```

## Audit

```txt
GET    /api/planning/audit-events
GET    /api/planning/routes/:routeId/audit-events
```

## Priority for implementation

MVP order:

```txt
1. GET routes
2. GET route details
3. lock/release route
4. GET unplanned orders
5. assign/unassign order
6. PATCH stop sequence
7. POST route recalculation proxy
8. export driver stop list / warehouse pick list
9. driver route execution endpoints
10. telemetry endpoint
```
