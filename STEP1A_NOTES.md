# RouteIQ Step 1A - Real File Safe Migration

This package uses the actual uploaded `RouteIQPrototype.jsx`, not a reconstructed stub.

## Scope
- Created `src/domains/planning/` architecture folders.
- Added `models.ts`, `types.ts`, and `utils/validation.ts`.
- Updated `RouteIQPrototype.jsx` minimally to import data and safe validation helpers.

## Not changed
- No UI redesign.
- No backend.
- No APIs.
- No reducers/selectors.
- No component extraction.
- No workflow behavior change.

## Changed imports in `RouteIQPrototype.jsx`
- `roles` now aliases `USER_ROLES`.
- `depots` now aliases `DEPOTS`.
- `routes` now aliases `ROUTES`.
- `unplannedOrders` now aliases `UNPLANNED_ORDERS`.
- Viewer cost visibility uses `canViewCosts(role)`.
- Hard capacity warning uses `isHardCapacityExceeded(route)`.
- Depot filtering uses `filterRoutesByDepot(routes, depot)`.
