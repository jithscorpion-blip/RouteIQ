# RouteIQ Step 6 — MapMock Safe Extraction

## Scope
Extracted the `MapMock` panel only from `src/RouteIQPrototype.jsx` into:

```txt
src/domains/planning/components/MapMock.jsx
```

## Updated

```txt
src/domains/planning/components/index.js
src/RouteIQPrototype.jsx
```

## Preserved

- No UI redesign
- No backend
- No APIs
- No reducers
- No planningState.ts
- No RouteTable extraction
- No workflow behavior change

## Import now used

```jsx
import { MapMock } from "./domains/planning/components";
```
