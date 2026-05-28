# RouteIQ Productization Next Steps

## Step P1 — Local build fix completed

Build was tested with:

```bash
npm install
npm run build
```

Result: build passed.

## Build issue fixed

The project was using Tailwind CSS as a direct PostCSS plugin. Newer Tailwind versions require `@tailwindcss/postcss`.

Updated files:

- `package.json`
- `postcss.config.js`
- `package-lock.json`

## Remaining productization phases

### P2 — Connect real route/order/customer data

Do this before backend persistence. Keep it frontend-only first by replacing mock data with imported JSON/CSV-converted data.

Recommended master data:

- Customer master
- Vehicle master
- Route master
- Order backlog
- Depot/zone master
- Driver master
- Item master
- Service time master

### P3 — Add backend persistence

Add only after frontend data contracts are stable.

Recommended stack for MVP:

- Supabase or Firebase for quick MVP
- PostgreSQL for serious production
- Node/FastAPI backend if custom business rules grow

### P4 — Select map/routing provider

Recommended direction:

- Planning map: Mapbox or HERE
- Navigation handoff: Google Maps / Apple Maps deep links
- Route optimization: OR-Tools / GraphHopper / HERE Matrix API later

### P5 — Add driver mobile workflow

Start as mobile web/PWA before native app.

Driver workflow:

- Login
- Assigned route
- Stop list
- Start trip
- Arrived at stop
- Delivered / failed / skipped
- Proof of delivery
- Reason codes
- End trip

### P6 — Add live ETA / GPS tracking later

Do not add live GPS in early MVP. First capture actual events manually.

Later add:

- GPS pings
- Live ETA
- Planned vs actual route path
- Stop-level delay alerts
- Supervisor dashboard
