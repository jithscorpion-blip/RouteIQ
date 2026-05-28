/**
 * RouteIQ Planning Selectors
 *
 * Step 2 safe extraction.
 * Selectors contain read-only derived/computed values used by RouteIQPrototype.jsx.
 * No UI redesign, no backend, no API, no workflow behavior change.
 */

import type { PlanningKpis, RoutePlan, UnplannedOrder, UserRole } from "../types";
import { canViewCosts, filterRoutesByDepot } from "../utils/validation";

export function selectVisibleRoutes<T extends Pick<RoutePlan, "depot">>(
  routes: T[],
  depot: RoutePlan["depot"] | "ALL"
): T[] {
  return filterRoutesByDepot(routes, depot);
}

export function selectCriticalRouteCount(routes: Pick<RoutePlan, "status">[]): number {
  return routes.filter((route) => route.status === "Critical").length;
}

export function selectAverageHardCapacityUtilization(
  routes: Pick<RoutePlan, "weightPct" | "cbmPct" | "efPct">[]
): number {
  return Math.round(
    routes.reduce((total, route) => total + Math.max(route.weightPct, route.cbmPct, route.efPct), 0) /
      (routes.length || 1)
  );
}

export function selectTripCost(routes: Pick<RoutePlan, "costPerTrip">[]): number {
  return routes.reduce((total, route) => total + route.costPerTrip, 0);
}

export function selectPlanningKpis(
  routes: RoutePlan[],
  unplannedOrders: UnplannedOrder[],
  role: UserRole
): PlanningKpis {
  const kpis: PlanningKpis = {
    routes: routes.length,
    critical: selectCriticalRouteCount(routes),
    depotUtilizationPct: selectAverageHardCapacityUtilization(routes),
    unplannedOrders: unplannedOrders.length,
  };

  if (canViewCosts(role)) {
    kpis.tripCost = selectTripCost(routes);
  }

  return kpis;
}
