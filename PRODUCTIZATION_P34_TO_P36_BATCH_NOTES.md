# RouteIQ Productization P34–P36 Notes

## Completed

- P34: Backend integration smoke test script
- P35: Import validation for customer/order/route/vehicle data
- P36: Frontend API client switch between mock mode and backend mode

## Added

### Backend tests

- `server/tests/integrationSmokeTest.js`
- `npm run test:integration`
- `npm run test:backend`

The smoke test starts the backend on a random available port and checks:

- `GET /api/health`
- `GET /api/routes`
- validation failure behavior for `POST /api/orders/assign`
- route upsert flow
- telemetry location ingestion flow

### Import validation

- `server/importValidation/importSchemas.js`
- `server/importValidation/importValidator.js`
- `server/importValidation/index.js`
- `server/importValidation/README.md`
- `src/domains/planning/importer/importValidation.ts`

New backend endpoints:

- `GET /api/import/schemas`
- `POST /api/import/validate`

### Frontend API client mode switch

- `src/domains/planning/api/client/apiMode.ts`
- `src/domains/planning/api/client/backendPlanningClient.ts`
- `src/domains/planning/api/client/mockPlanningClient.ts`
- `src/domains/planning/api/client/planningApiClient.ts`
- `src/domains/planning/api/client/index.ts`

Environment controls:

- `VITE_ROUTEIQ_API_MODE=mock | backend`
- `VITE_ROUTEIQ_API_BASE_URL=http://localhost:8787`
- `VITE_ROUTEIQ_API_TOKEN=dev-admin-token`

## Preserved

- Mock mode remains default
- No production database required
- No paid Google API call enabled
- No real authentication provider added
- No frontend workflow behavior changed
