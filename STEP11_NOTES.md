# RouteIQ Step 11 — Clean RouteIQPrototype.jsx Imports

## Scope
Cleaned RouteIQPrototype.jsx imports and removed unused aliases only.

## Changed
- Removed unused imported aliases:
  - depots
  - roles
  - routes
  - unplannedOrders
- Replaced with direct domain constants:
  - ROUTES
  - UNPLANNED_ORDERS
- Reformatted the planning components import into a readable multi-line grouped import.
- Removed extra blank lines before the exported component.

## Preserved
- No UI redesign
- No backend
- No APIs
- No reducers
- No planningState.ts
- No new selectors
- No component extraction
- No workflow behavior change
