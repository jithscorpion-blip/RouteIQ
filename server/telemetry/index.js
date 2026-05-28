export const LIVE_TRACKING_MODES = {
  POLLING: "polling",
  WEBSOCKET_FUTURE: "websocket-future",
};

export function getLiveTrackingPlan() {
  return {
    currentMode: LIVE_TRACKING_MODES.POLLING,
    recommendedPollSeconds: 15,
    futureMode: LIVE_TRACKING_MODES.WEBSOCKET_FUTURE,
    endpoints: {
      ingest: "POST /api/telemetry/location",
      latest: "GET /api/telemetry?routeId=...",
    },
  };
}
