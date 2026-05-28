# RouteIQ Step 3 — Small Component Extraction

## Scope completed

Extracted only small reusable UI components from `src/RouteIQPrototype.jsx` into the planning domain component folder.

Created:

```txt
src/domains/planning/components/CapacityBar.jsx
src/domains/planning/components/KpiCards.jsx
src/domains/planning/components/RouteStatusBadge.jsx
src/domains/planning/components/index.js
```

Updated:

```txt
src/RouteIQPrototype.jsx
```

## What was moved

- `CapacityBar` moved to `components/CapacityBar.jsx`
- KPI cards moved to `components/KpiCards.jsx`
- Route status badge styling moved to `components/RouteStatusBadge.jsx`

## Guardrails preserved

- No UI redesign
- No backend
- No APIs
- No reducers
- No planningState.ts
- No full table extraction
- No workflow behavior change

## Next safe step

Step 4: Extract route-detail side panel only, after verifying Step 3 renders correctly.
