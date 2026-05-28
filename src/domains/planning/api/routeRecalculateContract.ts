import type { RoutePlan, RouteStop } from "../types";
import type { GoogleRoutesRequestDraft } from "../routing/googleRoutesAdapter";

export type RouteRecalculateProvider = "google-routes" | "mapbox" | "openrouteservice" | "mock";
export type RouteRecalculateReason = "manual-recalculate" | "manual-resequence" | "order-assignment" | "planner-review";

export interface RouteRecalculateStopInput {
  stopId: string;
  sequenceNo: number;
  customerCode: string;
  customerName: string;
  lat: number;
  lng: number;
  serviceTimeMin: number;
}

export interface RouteRecalculateRequest {
  requestId: string;
  provider: RouteRecalculateProvider;
  reason: RouteRecalculateReason;
  routeKey: string;
  depot: RoutePlan["depot"];
  routeNo: RoutePlan["routeNo"];
  tripNo: RoutePlan["tripNo"];
  departureTimeIso?: string;
  trafficAware: boolean;
  optimizeWaypointOrder: boolean;
  cacheKey: string;
  stops: RouteRecalculateStopInput[];
  providerPayload?: GoogleRoutesRequestDraft | Record<string, unknown> | null;
}

export interface RouteRecalculateStopResult {
  stopId: string;
  plannedSequenceNo: number;
  etaIso?: string;
  distanceFromPreviousKm?: number;
  driveTimeFromPreviousMin?: number;
}

export interface RouteRecalculateResult {
  requestId: string;
  routeKey: string;
  provider: RouteRecalculateProvider;
  cacheKey: string;
  cacheHit: boolean;
  totalDistanceKm: number;
  totalDriveTimeMin: number;
  totalServiceTimeMin: number;
  totalRouteTimeMin: number;
  stops: RouteRecalculateStopResult[];
  providerReference?: string;
  warnings: string[];
  calculatedAtIso: string;
}

export interface RouteRecalculateError {
  requestId?: string;
  code:
    | "INVALID_ROUTE"
    | "INSUFFICIENT_STOPS"
    | "PROVIDER_NOT_CONFIGURED"
    | "PROVIDER_LIMIT_EXCEEDED"
    | "PROVIDER_ERROR"
    | "UNKNOWN_ERROR";
  message: string;
  retryable: boolean;
}

export function createRouteRecalculateRequest(params: {
  route: RoutePlan;
  stops: RouteStop[];
  provider: RouteRecalculateProvider;
  reason: RouteRecalculateReason;
  cacheKey: string;
  providerPayload?: GoogleRoutesRequestDraft | Record<string, unknown> | null;
  departureTimeIso?: string;
  trafficAware?: boolean;
  optimizeWaypointOrder?: boolean;
}): RouteRecalculateRequest {
  const routeKey = `${params.route.depot}:${params.route.routeNo}:T${params.route.tripNo}`;
  const requestId = `recalc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    requestId,
    provider: params.provider,
    reason: params.reason,
    routeKey,
    depot: params.route.depot,
    routeNo: params.route.routeNo,
    tripNo: params.route.tripNo,
    departureTimeIso: params.departureTimeIso,
    trafficAware: params.trafficAware ?? true,
    optimizeWaypointOrder: params.optimizeWaypointOrder ?? false,
    cacheKey: params.cacheKey,
    providerPayload: params.providerPayload ?? null,
    stops: params.stops.map((stop) => ({
      stopId: stop.stopId,
      sequenceNo: stop.sequenceNo,
      customerCode: stop.customerCode,
      customerName: stop.customerName,
      lat: stop.lat,
      lng: stop.lng,
      serviceTimeMin: stop.serviceTimeMin,
    })),
  };
}

export function validateRouteRecalculateRequest(request: RouteRecalculateRequest): RouteRecalculateError | null {
  if (!request.routeNo || !request.depot) {
    return {
      requestId: request.requestId,
      code: "INVALID_ROUTE",
      message: "Route number and depot are required before recalculation.",
      retryable: false,
    };
  }

  if (request.stops.length < 2) {
    return {
      requestId: request.requestId,
      code: "INSUFFICIENT_STOPS",
      message: "At least two stops are required to recalculate a route.",
      retryable: false,
    };
  }

  return null;
}
