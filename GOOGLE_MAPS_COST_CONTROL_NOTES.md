# RouteIQ Google Maps Cost-Control Notes

This package adds a cost-controlled routing layer for RouteIQ.

## Decision

Google Maps Platform remains the selected provider for paid planning calculations, but RouteIQ should not call Google APIs automatically during normal UI browsing.

## Policy

- No routing API call on screen load.
- No routing API call on route selection.
- Driver navigation uses Google Maps / Apple Maps external links.
- Traffic-aware ETA is allowed only when planner explicitly clicks a future Recalculate / Optimize action.
- Route results should be cached using route + trip + stop sequence signature.
- Google API keys must be protected server-side before production use.

## Added files

- `src/domains/planning/routing/costControl.ts`
- `src/domains/planning/routing/routeResultCache.ts`
- `src/domains/planning/routing/googleRoutesAdapter.ts`
- `src/domains/planning/components/RoutingCostControlPanel.jsx`

## Still not added

- No real Google API key.
- No live API call.
- No paid request from browser.
- No backend Google Routes proxy yet.
- No pricing calculator yet.

## Next step

Add a backend/serverless proxy contract for `POST /api/routes/recalculate` before any real Google Routes API call is introduced.
