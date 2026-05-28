# RouteIQ Productization P3-P6 Notes

## P3 — Backend persistence foundation
Added a storage adapter pattern and a local browser persistence adapter. This is intentionally safe for the prototype while preserving a clean swap path to a real backend later.

## P4 — Map/routing provider selection
Selected Google Maps Platform as the primary planning/navigation provider for the next implementation phase. Mapbox and OpenRouteService remain documented fallbacks.

## P5 — Driver mobile workflow foundation
Added a driver workflow projection from sequenced stops, including stop serial number, customer, ETA, cases, proof requirement, status, and Google/Apple navigation links.

## P6 — Live ETA / GPS tracking foundation
Added mock live tracking and ETA snapshot models/selectors. No live GPS provider or routing API is connected yet.

## Production warning
Do not expose map provider API keys in frontend code. Route matrix, traffic ETA, optimization calls, and GPS ingestion must be routed through backend services before production.
