# RouteIQ MVP Handoff Checklist

## Ready
- Frontend planning prototype builds.
- Backend skeleton runs in memory fallback mode.
- Repository/service/API layering exists.
- PostgreSQL adapter boundary exists.
- Migration and seed dry-run scripts exist.
- API DTO contracts exist.
- Import validation exists.
- Demo auth/session handling exists.
- Google Routes server call is behind disabled flag.
- GPS polling foundation exists.

## Before real pilot
- Choose deployment host.
- Create production database.
- Apply migrations in staging first.
- Replace demo auth with real auth provider.
- Restrict Google API key server-side.
- Configure billing budget alerts and quotas.
- Configure CORS to exact domains.
- Configure HTTPS only.
- Add log retention and monitoring.

## Before paid routing
- Enable backend cache.
- Confirm API quotas.
- Validate stop coordinates.
- Add request throttling.
- Keep frontend from calling Google directly.

## Before live GPS
- Driver consent and access policy.
- Ping rate limit.
- Stale-location handling.
- Role-based location visibility.
- Data retention policy.
