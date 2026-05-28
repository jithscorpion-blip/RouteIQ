import type { DriverWorkflowStop, DriverWorkflowSummary, RouteNavigationProvider, RouteStop } from "../types";
import { buildNavigationUrl } from "../routing/navigationLinks";

export function buildDriverWorkflowStops(stops: RouteStop[], navigationProvider: RouteNavigationProvider = "google-maps-app"): DriverWorkflowStop[] {
  return stops.map((stop, index) => ({
    stopId: stop.stopId,
    routeNo: stop.routeNo,
    tripNo: stop.tripNo,
    sequenceNo: index + 1,
    customerCode: stop.customerCode,
    customerName: stop.customerName,
    plannedEta: stop.plannedEta,
    status: stop.status === "Completed" ? "Delivered" : "Pending",
    deliveryCases: stop.cases,
    proofRequired: true,
    navigationProvider,
    navigationUrl: buildNavigationUrl(stop, navigationProvider),
    driverNotes: stop.notes,
  }));
}

export function selectDriverWorkflowSummary(stops: DriverWorkflowStop[]): DriverWorkflowSummary | null {
  if (stops.length === 0) return null;
  const first = stops[0];
  const completedStops = stops.filter((stop) => stop.status === "Delivered").length;
  const exceptionStops = stops.filter((stop) => stop.status === "Skipped" || stop.status === "Failed").length;
  return {
    routeNo: first.routeNo,
    tripNo: first.tripNo,
    totalStops: stops.length,
    pendingStops: stops.length - completedStops - exceptionStops,
    completedStops,
    exceptionStops,
  };
}
