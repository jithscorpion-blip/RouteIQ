# RouteIQ P37-P40 Final MVP Hardening Notes

## P37 — Auth/login UI placeholder and role session handling
- Added demo session storage on the frontend.
- Added AuthSessionPanel for role/session visibility.
- Added backend demo auth endpoints:
  - GET /api/auth/demo-users
  - POST /api/auth/demo-login
  - GET /api/auth/session

## P38 — Production Google Routes server call behind disabled flag
- Added server/services/googleRoutesService.js.
- Live Google Routes is disabled by default.
- Required flags:
  - ROUTING_PROVIDER=google
  - GOOGLE_MAPS_API_KEY=...
  - ROUTEIQ_ENABLE_LIVE_GOOGLE_ROUTES=true
- Browser still never receives Google API key.

## P39 — GPS live tracking polling/WebSocket design
- Added polling client foundation.
- Added live tracking backend plan.
- Added GET /api/telemetry/live-plan.
- WebSocket/SSE is documented as future upgrade, not enabled prematurely.

## P40 — Final MVP deployment handoff package
- Added final handoff checklist.
- Added MVP readiness matrix.
- Added production cutover sequence.

## Still intentionally disabled
- Real production identity provider.
- Live paid Google API request.
- WebSocket live tracking.
- Production database execution unless configured.
