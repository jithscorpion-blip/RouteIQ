# RouteIQ Backend Validation Layer

This layer validates incoming MVP API payloads before service/repository logic runs.

Covered payloads:

- route create/update
- route recalculation
- order assignment
- order unassignment
- telemetry location ping

No external validation dependency is used yet. This keeps the backend skeleton lightweight. A later production hardening step can replace this with Zod/Joi schemas if required.
