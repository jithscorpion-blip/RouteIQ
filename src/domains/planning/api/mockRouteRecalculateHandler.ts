import type { RouteRecalculateRequest, RouteRecalculateResponse } from "./index";
import { validateRouteRecalculateRequest } from "./routeRecalculateContract";

export function mockRouteRecalculateHandler(request: RouteRecalculateRequest): RouteRecalculateResponse {
  const validationError = validateRouteRecalculateRequest(request);
  if (validationError) return { ok: false, error: validationError };

  const totalServiceTimeMin = request.stops.reduce((sum, stop) => sum + stop.serviceTimeMin, 0);
  const estimatedDriveTimeMin = Math.max(15, (request.stops.length - 1) * 18);
  const estimatedDistanceKm = Math.max(3, (request.stops.length - 1) * 7.5);

  return {
    ok: true,
    data: {
      requestId: request.requestId,
      routeKey: request.routeKey,
      provider: request.provider,
      cacheKey: request.cacheKey,
      cacheHit: false,
      totalDistanceKm: Number(estimatedDistanceKm.toFixed(1)),
      totalDriveTimeMin: estimatedDriveTimeMin,
      totalServiceTimeMin,
      totalRouteTimeMin: estimatedDriveTimeMin + totalServiceTimeMin,
      stops: request.stops.map((stop, index) => ({
        stopId: stop.stopId,
        plannedSequenceNo: index + 1,
        distanceFromPreviousKm: index === 0 ? 0 : 7.5,
        driveTimeFromPreviousMin: index === 0 ? 0 : 18,
      })),
      warnings: ["Mock calculation only. Replace with server-side provider integration before production."],
      calculatedAtIso: new Date().toISOString(),
    },
  };
}
