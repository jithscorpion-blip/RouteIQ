import type { RouteNavigationProvider, RouteStop } from "../types";

export function buildGoogleMapsNavigationUrl(stop: Pick<RouteStop, "lat" | "lng" | "customerName">): string {
  const destination = `${stop.lat},${stop.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

export function buildAppleMapsNavigationUrl(stop: Pick<RouteStop, "lat" | "lng" | "customerName">): string {
  const destination = `${stop.lat},${stop.lng}`;
  return `https://maps.apple.com/?daddr=${encodeURIComponent(destination)}&dirflg=d`;
}

export function buildNavigationUrl(stop: Pick<RouteStop, "lat" | "lng" | "customerName">, provider: RouteNavigationProvider): string {
  return provider === "apple-maps-app" ? buildAppleMapsNavigationUrl(stop) : buildGoogleMapsNavigationUrl(stop);
}
