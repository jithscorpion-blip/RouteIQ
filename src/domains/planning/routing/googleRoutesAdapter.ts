import type { RouteStop } from "../types";

export interface GoogleRoutesWaypoint {
  location: {
    latLng: {
      latitude: number;
      longitude: number;
    };
  };
}

export interface GoogleRoutesRequestDraft {
  origin: GoogleRoutesWaypoint;
  destination: GoogleRoutesWaypoint;
  intermediates: GoogleRoutesWaypoint[];
  travelMode: "DRIVE";
  routingPreference: "TRAFFIC_AWARE" | "TRAFFIC_UNAWARE";
  computeAlternativeRoutes: false;
  optimizeWaypointOrder: boolean;
}

export function toGoogleWaypoint(stop: Pick<RouteStop, "lat" | "lng">): GoogleRoutesWaypoint {
  return {
    location: {
      latLng: {
        latitude: stop.lat,
        longitude: stop.lng,
      },
    },
  };
}

export function buildGoogleRoutesRequestDraft(stops: Pick<RouteStop, "lat" | "lng">[], options?: { trafficAware?: boolean; optimizeWaypointOrder?: boolean }): GoogleRoutesRequestDraft | null {
  if (stops.length < 2) return null;

  return {
    origin: toGoogleWaypoint(stops[0]),
    destination: toGoogleWaypoint(stops[stops.length - 1]),
    intermediates: stops.slice(1, -1).map(toGoogleWaypoint),
    travelMode: "DRIVE",
    routingPreference: options?.trafficAware === false ? "TRAFFIC_UNAWARE" : "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    optimizeWaypointOrder: options?.optimizeWaypointOrder || false,
  };
}

export function getGoogleRoutesServerReminder(): string {
  return "Call Google Routes API from a backend/serverless function only. Do not expose unrestricted API keys in the browser.";
}
