import type { ServerRouteRecalculateRequest } from "./serverRoutingContract";

export const buildGoogleRoutesComputeRoutesPayload = (request: ServerRouteRecalculateRequest) => {
  const [origin, ...remaining] = request.waypoints;
  const destination = remaining[remaining.length - 1] || origin;
  const intermediates = remaining.slice(0, -1);

  return {
    origin: { location: { latLng: { latitude: origin?.lat, longitude: origin?.lng } } },
    destination: { location: { latLng: { latitude: destination?.lat, longitude: destination?.lng } } },
    intermediates: intermediates.map((waypoint) => ({
      location: { latLng: { latitude: waypoint.lat, longitude: waypoint.lng } },
    })),
    travelMode: "DRIVE",
    routingPreference: request.trafficAware ? "TRAFFIC_AWARE" : "TRAFFIC_UNAWARE",
    computeAlternativeRoutes: false,
  };
};
