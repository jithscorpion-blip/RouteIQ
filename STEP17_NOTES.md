# Step 17 — Route Lock / Release Safe Functionality

## Scope
Added the first active workflow behavior after completing the safe frontend architecture refactor.

## Added
- `src/domains/planning/state/routeWorkflow.ts`
  - `getRouteKey()`
  - `findRouteByKey()`
  - `canLockRoute()`
  - `canReleaseRoute()`
  - `lockRoutePlan()`
  - `releaseRoutePlan()`

## Updated
- `src/RouteIQPrototype.jsx`
  - Routes now use local React state instead of static-only `ROUTES` rendering.
  - Selected route is tracked by stable route key.
  - Lock/release handlers are passed to `RouteDetails`.

- `src/domains/planning/components/RouteDetails.jsx`
  - Added `Lock Route` and `Release Route` controls.
  - Viewer cannot see route action controls.
  - Critical/hard-capacity-exceeded routes cannot be locked or released.

- `src/domains/planning/utils/validation.ts`
  - Added `canManageRoutes()` for Admin/Planner route workflow permissions.

## Preserved
- No backend.
- No APIs.
- No persistence.
- No route optimization algorithm change.
- No unplanned order assignment.
- No drag/drop.
- No redesign of existing layout.

## Business Rule Preserved
Routes with hard capacity violations — Weight, CBM, or EF above 100% — cannot be locked or released. Cases percentage remains reference-only.
