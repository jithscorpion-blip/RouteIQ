# RouteIQ Import Validation

Validates imported CSV/JSON rows before committing them to RouteIQ planning data.

Current entities:

- customers
- orders
- routes
- vehicles

This layer is intentionally independent from the database. It can be used by a future import preview endpoint, backend batch job, or admin upload screen.
