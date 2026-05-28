import type { PlanningSnapshot, OrderAssignmentPlan, RoutePlan, RouteStopSequencePlan, StopResequenceAuditNote } from "../types";

export const PLANNING_SNAPSHOT_VERSION = "routeiq-planning-v1" as const;

export function createPlanningSnapshot(params: {
  routes: RoutePlan[];
  stopSequencePlans: RouteStopSequencePlan[];
  assignmentPlans: OrderAssignmentPlan[];
  resequencingAuditNotes: StopResequenceAuditNote[];
}): PlanningSnapshot {
  return {
    version: PLANNING_SNAPSHOT_VERSION,
    savedAt: new Date().toISOString(),
    routes: params.routes,
    stopSequencePlans: params.stopSequencePlans,
    assignmentPlans: params.assignmentPlans,
    resequencingAuditNotes: params.resequencingAuditNotes,
  };
}

export function isPlanningSnapshot(value: unknown): value is PlanningSnapshot {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<PlanningSnapshot>;
  return (
    snapshot.version === PLANNING_SNAPSHOT_VERSION &&
    Array.isArray(snapshot.routes) &&
    Array.isArray(snapshot.stopSequencePlans) &&
    Array.isArray(snapshot.assignmentPlans) &&
    Array.isArray(snapshot.resequencingAuditNotes)
  );
}
