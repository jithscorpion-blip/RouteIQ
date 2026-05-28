# RouteIQ Database Migrations

This folder is the database migration staging area for the MVP.

Current migration:

- `001_initial_planning_schema.sql` — initial route, stop, order, vehicle, telemetry, and audit tables.

Rules:

- Review before production execution.
- Run first in a development database.
- Add rollback scripts before live rollout.
- Keep API DTO changes aligned with schema changes.
