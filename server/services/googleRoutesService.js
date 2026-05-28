import { serverConfig } from "../config/env.js";

function toWaypoint(stop) {
  const lat = Number(stop?.lat ?? stop?.latitude);
  const lng = Number(stop?.lng ?? stop?.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { location: { latLng: { latitude: lat, longitude: lng } } };
}

export function isGoogleRoutesLiveEnabled() {
  return Boolean(serverConfig.enableLiveGoogleRoutes && serverConfig.googleMapsApiKey);
}

export function buildGoogleRoutesRequest(payload) {
  const waypoints = (payload?.stops || []).map(toWaypoint).filter(Boolean);
  const origin = waypoints[0];
  const destination = waypoints[waypoints.length - 1] || origin;
  const intermediates = waypoints.length > 2 ? waypoints.slice(1, -1) : [];

  return {
    origin,
    destination,
    intermediates,
    travelMode: "DRIVE",
    routingPreference: payload?.trafficAware ? "TRAFFIC_AWARE" : "TRAFFIC_UNAWARE",
    computeAlternativeRoutes: false,
    units: "METRIC",
  };
}

export async function computeGoogleRoute(payload) {
  if (!isGoogleRoutesLiveEnabled()) {
    throw Object.assign(new Error("Live Google Routes call is disabled."), {
      statusCode: 503,
      code: "ROUTING_PROVIDER_UNAVAILABLE",
      details: [{ field: "ROUTEIQ_ENABLE_LIVE_GOOGLE_ROUTES", message: "Set true only after billing, quotas, key restrictions, and caching are configured." }],
    });
  }

  const requestBody = buildGoogleRoutesRequest(payload);
  if (!requestBody.origin || !requestBody.destination) {
    throw Object.assign(new Error("At least origin and destination coordinates are required."), {
      statusCode: 400,
      code: "VALIDATION_FAILED",
    });
  }

  const response = await fetch(serverConfig.googleRoutesEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": serverConfig.googleMapsApiKey,
      "x-goog-fieldmask": "routes.distanceMeters,routes.duration,routes.staticDuration,routes.polyline.encodedPolyline",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const text = await response.text();
    throw Object.assign(new Error("Google Routes API request failed."), {
      statusCode: 503,
      code: "ROUTING_PROVIDER_UNAVAILABLE",
      details: [{ status: response.status, response: text.slice(0, 500) }],
    });
  }

  const data = await response.json();
  const route = data.routes?.[0] || {};
  return {
    provider: "google-routes",
    routeId: payload?.routeId ?? "unknown-route",
    estimatedDistanceKm: route.distanceMeters ? Number((route.distanceMeters / 1000).toFixed(2)) : null,
    estimatedDurationMinutes: parseGoogleDurationMinutes(route.duration),
    trafficAware: Boolean(payload?.trafficAware),
    polyline: route.polyline?.encodedPolyline || null,
    recalculatedAt: new Date().toISOString(),
  };
}

function parseGoogleDurationMinutes(duration) {
  if (!duration || typeof duration !== "string") return null;
  const seconds = Number(duration.replace("s", ""));
  return Number.isFinite(seconds) ? Math.round(seconds / 60) : null;
}
