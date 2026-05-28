# RouteIQ Step 10 — RouteTable Safe Extraction

## Scope
Extracted only the Planned Routes table component from `RouteIQPrototype.jsx`.

## Created
- `src/domains/planning/components/RouteTable.jsx`

## Updated
- `src/domains/planning/components/index.js`
- `src/RouteIQPrototype.jsx`

## Preserved
- No UI redesign
- No backend
- No APIs
- No reducers
- No planningState.ts
- No workflow behavior change

## Notes
`RouteTable` still receives the same props from `RouteIQPrototype.jsx`:
- `visibleRoutes`
- `selected`
- `setSelected`
- `role`

The table row click behavior and selected route highlighting are unchanged.
