# RouteIQ P10 — API DTO Contracts

This folder defines the DTO layer for the RouteIQ MVP backend contract.

DTO means **Data Transfer Object**. These types describe the shape of request and response payloads between the React frontend and a future backend/serverless API.

## Scope added in P10

- Common response envelope and error structure
- Route list/detail DTOs
- Route lock/release DTOs
- Stop sequencing DTOs
- Order assignment DTOs
- Driver mobile DTOs
- Telemetry/live ETA DTOs
- Import/export DTOs
- Routing recalculation proxy DTO re-exports

## What P10 does not add

- No real backend server
- No database connection
- No API calls from UI
- No workflow behavior change
- No real Google/Mapbox/OpenRouteService request

## MVP rule

The frontend should call backend endpoints using these DTOs later. Google Maps or any paid routing provider must remain behind a backend proxy, never directly exposed from the browser.
