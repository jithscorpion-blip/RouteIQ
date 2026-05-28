# P42 Staging Smoke-Test Runner

Run the full P42 staging confidence check:

```bash
npm run staging:smoke
```

It checks:

1. Pilot CSV data can be parsed and validated.
2. Backend can start on a random local port.
3. Health endpoint works.
4. Demo Admin login works.
5. Authenticated session works.
6. Route and order list endpoints work.
7. Import schema and validation endpoints work.
8. Live tracking plan endpoint works.

This is safe for staging because it does not call Google Routes, does not write to PostgreSQL, and does not enable live GPS.
