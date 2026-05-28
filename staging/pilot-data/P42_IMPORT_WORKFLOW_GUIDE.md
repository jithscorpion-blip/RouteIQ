# P42 First Pilot Data Import Workflow

## Goal

Prepare the first real RouteIQ pilot data import without touching production data.

## Input files

Use these files as the first controlled pilot data pack:

- `customers_sample.csv`
- `orders_sample.csv`
- `vehicles_sample.csv`
- `routes_sample.csv`

Keep the first pilot small:

- 20 to 50 customers
- 5 to 10 routes
- 3 to 5 vehicles
- 1 depot first

## Run validation

```bash
npm run staging:pilot-import
```

## Review generated output

- `generated/pilot-import-preview.json`
- `generated/pilot-import-summary.txt`

## Pass condition

Continue only if:

- all required fields pass
- latitude/longitude are numeric
- order cases/weight/cbm are numeric
- vehicle capacity values are numeric
- route IDs and vehicle codes are populated

## Do not do yet

- Do not write this directly into production DB.
- Do not enable Google Routes.
- Do not activate live GPS.
- Do not upload full customer master before a small pilot succeeds.
