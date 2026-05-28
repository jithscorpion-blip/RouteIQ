/**
 * RouteIQ Planning Validation Utilities
 *
 * Foundation-only rules extracted from current prototype/business rules.
 * No reducer, no UI mutation, no backend/API behavior.
 */

import type { CapacityMetricKey, CapacityValidationResult, RoutePlan, UserRole } from "../types";

export const HARD_CAPACITY_METRICS: CapacityMetricKey[] = ["weightPct", "cbmPct", "efPct"];

export const REFERENCE_CAPACITY_METRICS: CapacityMetricKey[] = ["casesPct"];

const CAPACITY_LABELS: Record<CapacityMetricKey, string> = {
  casesPct: "Cases",
  weightPct: "Weight",
  cbmPct: "CBM",
  efPct: "EF",
};

export function isViewer(role: UserRole): boolean {
  return role === "Viewer";
}

export function canViewCosts(role: UserRole): boolean {
  return role === "Admin" || role === "Planner";
}

export function canManageRoutes(role: UserRole): boolean {
  return role === "Admin" || role === "Planner";
}

export function isHardCapacityExceeded(route: Pick<RoutePlan, "weightPct" | "cbmPct" | "efPct">): boolean {
  return HARD_CAPACITY_METRICS.some((metric) => route[metric] > 100);
}

export function getExceededHardCapacityMetrics(
  route: Pick<RoutePlan, "weightPct" | "cbmPct" | "efPct">
): CapacityMetricKey[] {
  return HARD_CAPACITY_METRICS.filter((metric) => route[metric] > 100);
}

export function validateRouteCapacity(route: RoutePlan): CapacityValidationResult {
  const exceededMetrics = getExceededHardCapacityMetrics(route);
  const messages = exceededMetrics.map((metric) => `${CAPACITY_LABELS[metric]} exceeded ${route[metric]}%`);

  return {
    isValid: exceededMetrics.length === 0,
    isCritical: exceededMetrics.length > 0,
    exceededMetrics,
    messages,
  };
}

export function canRouteBeLockedOrReleased(route: RoutePlan): boolean {
  return !isHardCapacityExceeded(route);
}

export function getCapacityBarTone(value: number, hard = true): "neutral" | "healthy" | "warning" | "critical" {
  if (!hard) return "neutral";
  if (value > 100) return "critical";
  if (value >= 90) return "warning";
  return "healthy";
}

export function filterRoutesByDepot<T extends Pick<RoutePlan, "depot">>(
  routes: T[],
  depot: RoutePlan["depot"] | "ALL"
): T[] {
  return depot === "ALL" ? routes : routes.filter((route) => route.depot === depot);
}
