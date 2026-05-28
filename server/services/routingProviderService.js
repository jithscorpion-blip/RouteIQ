import { serverConfig } from "../config/env.js";
import { computeGoogleRoute, isGoogleRoutesLiveEnabled } from "./googleRoutesService.js";

export async function recalculateRoute(payload) {
  if (serverConfig.routingProvider === "google" && isGoogleRoutesLiveEnabled()) {
    return computeGoogleRoute(payload);
  }

  return createMockRoutingResult(payload);
}

function createMockRoutingResult(payload) {
  const stopCount = payload?.stops?.length ?? 0;
  return {
    provider: "mock",
    routeId: payload?.routeId ?? "unknown-route",
    estimatedDistanceKm: Math.max(5, stopCount * 4.8),
    estimatedDurationMinutes: Math.max(20, stopCount * 11),
    trafficAware: Boolean(payload?.trafficAware),
    cacheKey: `mock-${payload?.routeId ?? "route"}-${stopCount}`,
    recalculatedAt: new Date().toISOString(),
  };
}
