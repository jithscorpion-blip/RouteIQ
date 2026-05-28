export type ServerRoutingProvider = "google-routes" | "mapbox" | "openrouteservice" | "mock";

export type ServerRouteWaypoint = {
  stopId?: string;
  customerCode?: string;
  lat: number;
  lng: number;
  serviceTimeMinutes?: number;
};

export type ServerRouteRecalculateRequest = {
  routeNo: string;
  tripNo: number;
  provider: ServerRoutingProvider;
  trafficAware: boolean;
  plannedDepartureIso?: string;
  waypoints: ServerRouteWaypoint[];
};

export type ServerRouteRecalculateResponse = {
  provider: ServerRoutingProvider;
  routeNo: string;
  tripNo: number;
  totalDistanceKm: number;
  totalDurationMinutes: number;
  trafficDelayMinutes: number;
  encodedPolyline?: string;
  providerRequestId?: string;
  cached: boolean;
};
