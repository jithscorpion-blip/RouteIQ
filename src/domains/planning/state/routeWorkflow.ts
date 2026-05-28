/**
 * RouteIQ Route Workflow State Helpers
 *
 * Step 17 safe functionality layer.
 * Pure route status helpers only.
 * No backend, no API calls, no persistence side effects.
 */

import type { RoutePlan, RouteStatus } from "../types";
import { canRouteBeLockedOrReleased } from "../utils/validation";

export type RouteIdentity = Pick<RoutePlan, "routeNo" | "tripNo">;

export function getRouteKey(route: RouteIdentity): string {
  return `${route.routeNo}::${route.tripNo}`;
}

export function findRouteByKey<T extends RouteIdentity>(routes: T[], routeKey: string): T | undefined {
  return routes.find((route) => getRouteKey(route) === routeKey);
}

export function canLockRoute(route: RoutePlan): boolean {
  return canRouteBeLockedOrReleased(route) && route.status !== "Locked" && route.status !== "Released" && route.status !== "Completed";
}

export function canReleaseRoute(route: RoutePlan): boolean {
  return canRouteBeLockedOrReleased(route) && route.status === "Locked";
}

function updateRouteStatus(routes: RoutePlan[], target: RouteIdentity, status: RouteStatus): RoutePlan[] {
  const targetKey = getRouteKey(target);

  return routes.map((route) => {
    if (getRouteKey(route) !== targetKey) return route;
    return { ...route, status };
  });
}

export function lockRoutePlan(routes: RoutePlan[], target: RoutePlan): RoutePlan[] {
  if (!canLockRoute(target)) return routes;
  return updateRouteStatus(routes, target, "Locked");
}

export function releaseRoutePlan(routes: RoutePlan[], target: RoutePlan): RoutePlan[] {
  if (!canReleaseRoute(target)) return routes;
  return updateRouteStatus(routes, target, "Released");
}
