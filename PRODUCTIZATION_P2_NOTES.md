# RouteIQ Productization P2 — Connect Real Route / Order / Customer Data

## Completed

Added a frontend-only data connection foundation for real planning inputs.

## Added

```txt
src/domains/planning/data/
├── importContracts.ts
├── normalizers.ts
├── sampleImportedData.ts
├── index.ts
└── templates/
    ├── customers.csv
    ├── orders.csv
    ├── routes.csv
    └── vehicles.csv
```

## What this enables

RouteIQ can now accept real-world planning data in a controlled structure:

- Customer master
- Order input
- Existing route plan input
- Vehicle master

The normalizers convert imported route/order data into the current frontend models:

- `RoutePlan[]`
- `UnplannedOrder[]`

## What was intentionally not changed

- No backend
- No APIs
- No database
- No persistence
- No UI redesign
- No workflow behavior change
- No map provider integration
- No GPS / live ETA

## Next step

P3 should add backend persistence architecture, but only as a safe local persistence foundation first.
Do not connect production database yet.
