# RouteIQ Productization P24 to P27 Batch Notes

## Completed

- P24: PostgreSQL database adapter boundary.
- P25: Migration runner script with dry-run default.
- P26: Environment template and deployment checklist.
- P27: Production security checklist.

## Safe defaults

- Memory fallback remains default.
- Migrations do not execute unless explicitly enabled.
- PostgreSQL uses optional dynamic import of `pg`.
- No paid Google Maps call is enabled.
- No production secrets are stored.

## Next recommended production steps

- P28: Add repository layer for routes/orders/telemetry to use DB query adapter.
- P29: Add real auth provider integration plan.
- P30: Add staging deployment config.
