# RouteIQ P50–P55 Pilot-Ready Batch Notes

## Scope completed

This batch moves RouteIQ from a pure demo UI closer to a pilot-ready staging foundation.

### P50 — Local/staging persistence store
- Added JSON-backed local/staging store for backend persistence when PostgreSQL is not yet configured.
- Backend now reports `local-json-fallback` mode instead of pure memory fallback.
- Store path can be overridden with `ROUTEIQ_LOCAL_STORE_PATH`.
- PostgreSQL mode remains available through `ROUTEIQ_DATABASE_MODE=postgres` and `DATABASE_URL`.

### P51 — Import commit workflow
- Added `/api/import/bundle/validate`.
- Added `/api/import/commit`.
- Added `/api/import/history`.
- Import commit validates customer, vehicle, route, and order files as a bundle.
- Added cross-file checks:
  - Duplicate customer code
  - Duplicate order number
  - Order customer must exist in customer file
  - Order route must exist in route file when routeId is supplied
  - Route vehicle must exist in vehicle file
- Admin Upload UI now has a “Commit to staging store” action.
- Recent import history is shown after commit.

### P52 — Planning snapshot server sync
- Added `/api/planning/snapshot` GET and PUT.
- Product checkpoint banner now includes a “Server sync” action.
- Planner route changes still save locally in browser, and can now also be pushed to backend local/staging store.

### P53 — Warehouse export strengthened
- Existing warehouse pick list module and driver CSV export remain active.
- Export now sits on top of the broader persistence direction.

### P54 — Driver execution status foundation
- Added `/api/driver/stops/status`.
- Added `/api/driver/stops/events`.
- Driver module now has Start and Complete buttons per stop.
- Stop updates are stored locally in UI and pushed to backend where permissions allow.

### P55 — Basic login/session hardening
- Role change now attempts backend `/api/auth/demo-login` to obtain signed demo tokens.
- Fallback remains available for offline frontend demo.
- Admin and Planner roles can update stop status for staging demonstration.

## Validation

- `npm run build` passed.
- `npm run staging:p42` passed.
- New endpoints were manually smoke tested:
  - Demo login
  - Import commit
  - Import history
  - Planning snapshot save

## Current status after P55

RouteIQ is now stronger than demo-only, but still not full production.

Completed toward pilot:
- Local/staging backend persistence
- Import commit workflow
- Import history
- Server-side planning snapshot save
- Driver stop status update foundation
- Signed demo login token flow

Still pending for real production:
- Hosted staging deployment
- PostgreSQL/Supabase activation
- Real map routing
- Real GPS tracking
- Production auth provider
- Multi-tenant company isolation
- Backup/monitoring/security hardening
