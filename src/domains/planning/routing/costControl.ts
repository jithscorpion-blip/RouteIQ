import type { RoutePlan, RouteStop } from "../types";

export type RoutingCostMode = "display-only" | "on-demand-planning" | "live-tracking";
export type RoutingRequestTrigger = "screen-load" | "route-select" | "manual-recalculate" | "driver-open-navigation" | "gps-refresh";

export interface RoutingCostPolicy {
  mode: RoutingCostMode;
  allowApiOnScreenLoad: boolean;
  allowApiOnRouteSelect: boolean;
  allowTrafficAwareEta: boolean;
  allowLiveRefresh: boolean;
  cacheTtlMinutes: number;
  maxStopsPerPlanningRequest: number;
  recommendedTrigger: RoutingRequestTrigger;
  notes: string[];
}

export interface RoutingUsageEstimate {
  routeKey: string;
  stopCount: number;
  estimatedPlanningCalls: number;
  estimatedNavigationCalls: number;
  cacheEligible: boolean;
  warning?: string;
}

export const ROUTEIQ_ROUTING_COST_POLICY: RoutingCostPolicy = {
  mode: "on-demand-planning",
  allowApiOnScreenLoad: false,
  allowApiOnRouteSelect: false,
  allowTrafficAwareEta: true,
  allowLiveRefresh: false,
  cacheTtlMinutes: 240,
  maxStopsPerPlanningRequest: 25,
  recommendedTrigger: "manual-recalculate",
  notes: [
    "Use Google Routes only when the planner clicks Recalculate / Optimize.",
    "Do not call paid routing APIs on every render, depot filter, or route selection.",
    "Use Google Maps / Apple Maps deep links for driver navigation handoff.",
    "Cache route calculations until route, stops, departure window, or traffic option changes.",
  ],
};

export function getRouteCacheKey(route: Pick<RoutePlan, "routeNo" | "tripNo" | "depot">, stops: Pick<RouteStop, "stopId" | "sequenceNo" | "lat" | "lng">[]): string {
  const stopSignature = stops
    .map((stop) => `${stop.stopId}:${stop.sequenceNo}:${stop.lat.toFixed(5)},${stop.lng.toFixed(5)}`)
    .join("|");
  return `${route.depot}:${route.routeNo}:T${route.tripNo}:${stopSignature}`;
}

export function shouldCallRoutingApi(trigger: RoutingRequestTrigger, policy: RoutingCostPolicy = ROUTEIQ_ROUTING_COST_POLICY): boolean {
  if (trigger === "screen-load") return policy.allowApiOnScreenLoad;
  if (trigger === "route-select") return policy.allowApiOnRouteSelect;
  if (trigger === "gps-refresh") return policy.allowLiveRefresh;
  if (trigger === "driver-open-navigation") return false;
  return trigger === policy.recommendedTrigger;
}

export function estimateRoutingUsage(route: RoutePlan | null | undefined, stops: RouteStop[], policy: RoutingCostPolicy = ROUTEIQ_ROUTING_COST_POLICY): RoutingUsageEstimate | null {
  if (!route) return null;

  const stopCount = stops.length;
  const warning =
    stopCount > policy.maxStopsPerPlanningRequest
      ? `Stop count is above ${policy.maxStopsPerPlanningRequest}. Split route or use backend optimization batch later.`
      : undefined;

  return {
    routeKey: `${route.routeNo}-T${route.tripNo}`,
    stopCount,
    estimatedPlanningCalls: stopCount > 1 ? 1 : 0,
    estimatedNavigationCalls: stopCount,
    cacheEligible: stopCount > 1,
    warning,
  };
}
