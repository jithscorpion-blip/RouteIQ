# RouteIQ P42 Pilot Data Import Workflow

This folder contains the first staging-safe pilot import workflow.

## Purpose

Validate the first RouteIQ pilot data pack before any database write happens.

It reads:

- `staging/pilot-data/customers_sample.csv`
- `staging/pilot-data/orders_sample.csv`
- `staging/pilot-data/vehicles_sample.csv`
- `staging/pilot-data/routes_sample.csv`

Then it normalizes the CSV headers into RouteIQ API field names and runs backend import validation.

## Run

```bash
npm run staging:pilot-import
```

## Output

Generated files:

- `staging/pilot-data/generated/pilot-import-preview.json`
- `staging/pilot-data/generated/pilot-import-summary.txt`

## Safety

This workflow is validate-only. It does not write to PostgreSQL, does not call Google Routes, and does not change planner state.
