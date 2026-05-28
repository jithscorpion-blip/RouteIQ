# RouteIQ Live Tracking Design

## MVP mode
Use HTTP polling first.

```txt
Driver browser/mobile -> POST /api/telemetry/location
Planner dashboard     -> GET /api/telemetry?routeId=...
```

Recommended polling interval:

```txt
10–30 seconds for active route view
60–120 seconds for background dashboard
```

## Future WebSocket/SSE mode
Add WebSocket/SSE only after real dispatch volume is known.

```txt
Driver location ping -> backend telemetry service -> broadcast route channel -> planner dashboard
```

Suggested channel names:

```txt
route:{routeId}:telemetry
vehicle:{vehicleId}:telemetry
driver:{driverId}:status
```

## Safety controls
- Authenticate every driver ping.
- Validate lat/lng range.
- Reject stale timestamps.
- Store telemetry history separately from latest snapshot.
- Avoid sending exact driver location to users without permission.
- Rate-limit location pings.
