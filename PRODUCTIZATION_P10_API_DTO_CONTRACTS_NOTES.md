# RouteIQ Productization P10 — API DTO Contracts

## Completed

P10 adds request/response DTO contracts for the MVP backend endpoints defined in P9.

## Added

```txt
src/domains/planning/api/dto/
├── README.md
├── commonDtos.ts
├── routeDtos.ts
├── stopSequenceDtos.ts
├── orderDtos.ts
├── driverDtos.ts
├── telemetryDtos.ts
├── importExportDtos.ts
├── routingDtos.ts
└── index.ts
```

## DTO coverage

- Common API response envelope
- Common API error format
- Route list and route detail
- Route lock and release
- Stop sequencing read/update
- Unplanned order list
- Assign/unassign order
- Driver mobile route and stop status update
- GPS telemetry location ping
- Live ETA response
- Import preview and commit
- Driver stop list export
- Warehouse pick list export
- Route recalculation proxy DTO re-export

## Safety boundaries

P10 is contract-only.

It does not add:

- Real backend server
- Database connection
- API implementation
- UI API calls
- Google Maps paid request
- Workflow behavior change

## Next step

P11 should add mock backend/serverless handlers using these DTOs only.
