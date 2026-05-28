/**
 * RouteIQ Stop Sequencing Selectors
 *
 * Step 19 safe extraction.
 * Read-only selectors for route stop sequence plans.
 * No UI change, no drag/drop, no reducers, no backend, no APIs.
 */

import type { RouteStop, RouteStopSequencePlan } from "../types";

export function getRouteSequenceKey(routeNo: string, tripNo: number): string {
  return `${routeNo}::${tripNo}`;
}

export function selectStopSequencePlan(
  plans: RouteStopSequencePlan[],
  routeNo: string,
  tripNo: number
): RouteStopSequencePlan | undefined {
  return plans.find((plan) => plan.routeNo === routeNo && plan.tripNo === tripNo);
}

export function selectStopsForRoute(
  plans: RouteStopSequencePlan[],
  routeNo: string,
  tripNo: number
): RouteStop[] {
  return selectStopSequencePlan(plans, routeNo, tripNo)?.stops ?? [];
}

export function getActiveStopSequence(stop: Pick<RouteStop, "plannedSeq" | "manualSeq">): number {
  return stop.manualSeq ?? stop.plannedSeq;
}

export function sortStopsByActiveSequence<T extends Pick<RouteStop, "plannedSeq" | "manualSeq">>(
  stops: T[]
): T[] {
  return [...stops].sort((a, b) => getActiveStopSequence(a) - getActiveStopSequence(b));
}

export function selectSequencedStopsForRoute(
  plans: RouteStopSequencePlan[],
  routeNo: string,
  tripNo: number
): RouteStop[] {
  return sortStopsByActiveSequence(selectStopsForRoute(plans, routeNo, tripNo));
}

export function selectManualSequencedStops(stops: RouteStop[]): RouteStop[] {
  return stops.filter((stop) => stop.manualSeq !== null || stop.sequenceSource === "Manual");
}

export function selectSystemSequencedStops(stops: RouteStop[]): RouteStop[] {
  return stops.filter((stop) => stop.manualSeq === null && stop.sequenceSource === "System");
}

export function hasManualSequenceChanges(stops: RouteStop[]): boolean {
  return stops.some((stop) => stop.manualSeq !== null || stop.sequenceSource === "Manual");
}

export function selectStopSequenceSummary(stops: RouteStop[]) {
  const totalStops = stops.length;
  const manualStops = selectManualSequencedStops(stops).length;
  const systemStops = totalStops - manualStops;
  const totalCases = stops.reduce((total, stop) => total + stop.cases, 0);
  const totalServiceMinutes = stops.reduce((total, stop) => total + stop.serviceMinutes, 0);

  return {
    totalStops,
    manualStops,
    systemStops,
    totalCases,
    totalServiceMinutes,
    hasManualChanges: manualStops > 0,
  };
}
