# RouteIQ Planning Domain

This folder contains the extracted planning frontend domain for the RouteIQ React prototype.

## Current scope

This is still a frontend-only prototype extraction. The goal is to keep the existing UI and workflow behavior unchanged while moving planning logic into small, readable modules.

## Folder structure

```txt
src/domains/planning/
├── components/     # Planning UI components extracted from RouteIQPrototype.jsx
├── state/          # Read-only selectors for derived planning values
├── utils/          # Business validation helpers
├── models.ts       # Mock planning data and role/depot constants
├── types.ts        # Planning domain TypeScript contracts
└── index.js        # Safe domain barrel exports
```

## Business rules preserved

- Cases percentage is reference-only.
- Weight, CBM, and EF are hard capacity checks.
- Hard capacity violations block lock/release decisions.
- Viewer role must not see costing fields.
- Admin and Planner roles can see costing fields.
- No backend, API, database, or workflow behavior was added during this refactor.

## Extraction status

Extracted from `RouteIQPrototype.jsx`:

- Header
- Sidebar
- PlanningToolbar
- KpiCards
- RouteTable
- RouteDetails
- UnplannedOrders
- MapMock
- CapacityBar
- RouteStatusBadge
- selectors.ts
- validation.ts
- models.ts
- types.ts

## Do not add yet

Reducers should not be added until RouteIQ has real state-changing planning actions such as:

- Drag/drop order assignment
- Manual stop sequencing
- Split route
- Merge route
- Lock route
- Release route
- Re-optimize route
- Driver mobile actual-vs-planned events

Until then, simple React state in `RouteIQPrototype.jsx` is safer.


## Step 18: Manual stop sequencing data model

Added stop-sequencing domain types and mock seed data only. This step does not add drag/drop, reducers, route optimization, persistence, backend APIs, or UI changes.

New domain concepts:

- `RouteStop`
- `RouteStopSequencePlan`
- `RouteStopType`
- `RouteStopStatus`
- `RouteStopSequenceSource`
- `ROUTE_STOP_SEQUENCE_PLANS`

This prepares RouteIQ for future manual sequencing without changing current workflow behavior.

## Step 19: Stop sequencing selectors

Added read-only stop sequencing selectors only. These selectors prepare the frontend to display and validate route stop order later without adding UI, drag/drop, reducers, backend APIs, or workflow changes.

New selector capabilities:

- Find a sequence plan by route/trip
- Read stops for a selected route/trip
- Sort stops by active sequence
- Prefer manual sequence when available
- Detect whether manual sequence changes exist
- Summarize stop count, cases, and service minutes


## Phase A to E Frontend Prototype Completion

Completed after Step 19:

- Phase A: Manual stop sequencing
  - Stop sequence panel
  - Move up / move down helpers
  - Controlled manual resequencing UI
  - Resequencing audit notes

- Phase B: Unplanned order assignment
  - Assignment data model
  - Assignment selectors
  - Assign / unassign helpers
  - Controlled assignment UI

- Phase C: Driver and warehouse outputs
  - Driver stop list row model
  - Warehouse pick list row model
  - CSV export helpers
  - Export buttons

- Phase D: Planned vs actual monitoring foundation
  - Actual route metric model
  - Variance selectors
  - Read-only variance panel

- Phase E: Final stabilization
  - No reducer added yet
  - Existing simple React state remains acceptable
  - Reducer should be added later only when workflow state becomes harder to maintain

Still intentionally out of scope:

- Backend/API
- Database persistence
- Live ETA
- External map routing
- Drag-and-drop sequencing
- Auto-optimization engine
- Driver mobile app


## Productization P2 — Real data connection foundation

The planning domain now includes a frontend-only `data/` layer for route, order, customer, and vehicle input contracts.

Added files:

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

Purpose:
- Standardize real customer/order/route/vehicle input structure before backend work.
- Allow CSV/JSON import data to be normalized into the current RouteIQ frontend models.
- Keep the existing prototype UI and workflow unchanged.

Not included in P2:
- No backend.
- No API calls.
- No database.
- No persistence.
- No routing provider integration.

## Productization P8 — Database schema draft

Database schema draft added under:

```txt
src/domains/planning/database/
```

This is documentation and backend-planning material only. The frontend does not connect directly to the database.

## Backend boundary added in P9

Backend service boundaries and endpoint catalog are documented under:

```txt
src/domains/planning/backend/
```

This is a design contract only. No production backend server has been added in P9.
