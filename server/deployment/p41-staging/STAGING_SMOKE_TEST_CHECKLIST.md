# RouteIQ Staging Smoke Test Checklist

## Backend checks

- [ ] `GET /api/health` returns `ok: true`
- [ ] `GET /api/auth/demo-users` returns demo users
- [ ] `POST /api/auth/demo-login` returns a demo session
- [ ] `GET /api/routes` returns planned routes
- [ ] `GET /api/orders` returns unplanned orders
- [ ] `POST /api/import/validate` validates sample data
- [ ] `POST /api/routes/recalculate` works in mock provider mode
- [ ] `POST /api/telemetry/location` accepts pilot location ping

## Frontend checks

- [ ] Vite build passes
- [ ] Planner screen loads
- [ ] Role switch works
- [ ] Viewer cost hiding works
- [ ] Route selection works
- [ ] Lock/release buttons remain controlled
- [ ] Import panel opens
- [ ] Driver mobile screen opens
- [ ] Live ETA panel remains mock/guarded

## Cost controls

- [ ] Google Routes disabled by default
- [ ] No browser Google API key
- [ ] Route recalculation goes through backend contract only
