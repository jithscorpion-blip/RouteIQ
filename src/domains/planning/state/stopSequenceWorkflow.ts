/**
 * RouteIQ Stop Sequencing Workflow Helpers
 *
 * Frontend-only helpers for controlled manual stop sequencing.
 * No drag/drop, backend, APIs, or persistence.
 */

import type { RouteStop, RouteStopSequencePlan, StopResequenceAuditNote, UserRole } from "../types";
import { getRouteSequenceKey, getActiveStopSequence, sortStopsByActiveSequence } from "./stopSequenceSelectors";

function normalizeManualSequence(stops: RouteStop[]): RouteStop[] {
  return sortStopsByActiveSequence(stops).map((stop, index) => ({
    ...stop,
    manualSeq: index + 1,
    sequenceSource: "Manual",
    status: stop.status === "Planned" ? "Sequenced" : stop.status,
  }));
}

export function moveStopInSequence(stops: RouteStop[], stopId: string, direction: "up" | "down"): RouteStop[] {
  const ordered = sortStopsByActiveSequence(stops);
  const index = ordered.findIndex((stop) => stop.stopId === stopId);
  if (index === -1) return stops;
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= ordered.length) return stops;
  const next = [...ordered];
  [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
  return normalizeManualSequence(next);
}

export function moveStopUp(stops: RouteStop[], stopId: string): RouteStop[] {
  return moveStopInSequence(stops, stopId, "up");
}

export function moveStopDown(stops: RouteStop[], stopId: string): RouteStop[] {
  return moveStopInSequence(stops, stopId, "down");
}

export function updateStopSequencePlan(
  plans: RouteStopSequencePlan[],
  routeNo: string,
  tripNo: number,
  stopId: string,
  direction: "up" | "down"
): RouteStopSequencePlan[] {
  return plans.map((plan) => {
    if (getRouteSequenceKey(plan.routeNo, plan.tripNo) !== getRouteSequenceKey(routeNo, tripNo)) return plan;
    return {
      ...plan,
      stops: moveStopInSequence(plan.stops, stopId, direction),
    };
  });
}

export function createResequenceAuditNote(
  routeNo: string,
  tripNo: number,
  stopId: string,
  direction: "up" | "down",
  role: UserRole
): StopResequenceAuditNote {
  return {
    id: `${routeNo}-${tripNo}-${stopId}-${Date.now()}`,
    routeNo,
    tripNo,
    stopId,
    action: direction === "up" ? "Move Up" : "Move Down",
    note: `Stop ${stopId} moved ${direction}.`,
    createdByRole: role,
    createdAt: new Date().toISOString(),
  };
}

export function getSequenceDeltaLabel(stop: Pick<RouteStop, "plannedSeq" | "manualSeq">): string {
  if (stop.manualSeq === null || stop.manualSeq === stop.plannedSeq) return "System";
  const delta = stop.plannedSeq - getActiveStopSequence(stop);
  return delta > 0 ? `Moved up ${delta}` : `Moved down ${Math.abs(delta)}`;
}
