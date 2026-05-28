import type { ServerRouteRecalculateRequest, ServerRouteRecalculateResponse } from "./serverRoutingContract";

export const buildMockServerRouteResult = (
  request: ServerRouteRecalculateRequest
): ServerRouteRecalculateResponse => {
  const stopCount = Math.max(request.waypoints.length, 1);
  const baseDistanceKm = stopCount * 4.8;
  const baseDurationMinutes = stopCount * 12;
  const trafficDelayMinutes = request.trafficAware ? Math.round(stopCount * 2.5) : 0;

  return {
    provider: request.provider,
    routeNo: request.routeNo,
    tripNo: request.tripNo,
    totalDistanceKm: Number(baseDistanceKm.toFixed(1)),
    totalDurationMinutes: baseDurationMinutes + trafficDelayMinutes,
    trafficDelayMinutes,
    cached: false,
    providerRequestId: `mock-${request.routeNo}-${request.tripNo}-${Date.now()}`,
  };
};

export const shouldUseServerRoutingProxy = () => true;

export const getServerRoutingSecurityNotes = () => [
  "Map provider keys must remain server-side.",
  "Cache route recalculation results by route, stops, provider, and departure window.",
  "Do not recalculate on every UI render or selection change.",
];
