# RouteIQ Step 2 — Safe Selectors Extraction

This package continues from Step 1A.

## Added

```txt
src/domains/planning/state/selectors.ts
```

## Updated

```txt
src/RouteIQPrototype.jsx
```

## What changed

- Moved read-only derived values into selectors:
  - visible route filtering
  - critical route count
  - average hard capacity utilization
  - trip cost total
  - KPI object creation

## What did not change

- No UI redesign
- No backend
- No APIs
- No reducers
- No planningState.ts
- No component extraction
- No workflow behavior change

## Why this is safe

Selectors are pure read-only functions. They do not mutate state, change JSX layout, or change route planning behavior.
