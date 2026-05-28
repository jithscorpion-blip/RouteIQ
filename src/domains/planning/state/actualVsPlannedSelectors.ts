/**
 * RouteIQ Planned vs Actual Selectors
 * Read-only variance calculations.
 */

import type { ActualRouteMetric, ActualVsPlannedSummary } from "../types";
import { getRouteSequenceKey } from "./stopSequenceSelectors";

export function selectActualMetricForRoute(
  metrics: ActualRouteMetric[],
  routeNo: string,
  tripNo: number
): ActualRouteMetric | undefined {
  return metrics.find((metric) => getRouteSequenceKey(metric.routeNo, metric.tripNo) === getRouteSequenceKey(routeNo, tripNo));
}

export function selectActualVsPlannedSummary(metric?: ActualRouteMetric): ActualVsPlannedSummary | null {
  if (!metric) return null;
  const hourVariance = Number((metric.actualHours - metric.plannedHours).toFixed(1));
  const serviceMinuteVariance = metric.actualServiceMinutes - metric.plannedServiceMinutes;
  const stopVariance = metric.actualStops - metric.plannedStops;
  const caseVariance = metric.actualCases - metric.plannedCases;
  const hasMajorVariance = Math.abs(hourVariance) >= 1 || Math.abs(serviceMinuteVariance) >= 15 || Math.abs(caseVariance) >= 10;
  const hasWatchVariance = Math.abs(hourVariance) >= 0.5 || Math.abs(serviceMinuteVariance) >= 8 || Math.abs(caseVariance) >= 5;
  return {
    routeNo: metric.routeNo,
    tripNo: metric.tripNo,
    stopVariance,
    caseVariance,
    hourVariance,
    serviceMinuteVariance,
    tone: hasMajorVariance ? "Variance" : hasWatchVariance ? "Watch" : "On Track",
  };
}
