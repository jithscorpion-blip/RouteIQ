# RouteIQ Security Checklist

## Secrets

- Never expose `DATABASE_URL` in frontend code.
- Never expose `GOOGLE_MAPS_API_KEY` in frontend code.
- Store secrets in platform secret manager.

## Authentication

- Replace demo token auth before real customer deployment.
- Enforce role-based permissions for Admin, Planner, Dispatcher, Driver, and Viewer.
- Log lock/release, assignment, resequencing, import, and routing actions.

## Data protection

- Avoid storing unnecessary precise GPS forever.
- Define retention for telemetry and audit events.
- Restrict viewer role from cost fields.

## Routing cost control

- Cache route recalculation results.
- Do not call Google on page load.
- Do not call Google on every map movement.
- Recalculate only on planner action or meaningful route change.
