export const DEFAULT_TRACKING_POLL_INTERVAL_MS = 15000;

export function createTelemetryPollUrl(routeId, baseUrl = "") {
  const params = routeId ? `?routeId=${encodeURIComponent(routeId)}` : "";
  return `${baseUrl}/api/telemetry${params}`;
}

export async function fetchLatestTelemetry({ routeId, token, baseUrl = "" }) {
  const response = await fetch(createTelemetryPollUrl(routeId, baseUrl), {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error(`Telemetry polling failed with status ${response.status}`);
  }
  return response.json();
}

export function createPollingPlan({ routeId, intervalMs = DEFAULT_TRACKING_POLL_INTERVAL_MS }) {
  return {
    mode: "polling",
    routeId,
    intervalMs,
    endpoint: createTelemetryPollUrl(routeId),
    upgradePath: "Replace polling with WebSocket/SSE after production telemetry volume is known.",
  };
}
