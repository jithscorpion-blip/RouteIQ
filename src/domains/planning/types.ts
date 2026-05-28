/**
 * RouteIQ Planning Domain Types
 *
 * Foundation-only step.
 * No UI redesign, no backend, no API, no workflow behavior change.
 */

export type UserRole = "Admin" | "Planner" | "Viewer";

export type DepotCode = "MCT-DC" | "SOH-DC" | "BRK-DC";

export type GeoZoneCode = "MCT" | "SOH" | "BRK";

export type RouteStatus =
  | "Suggested"
  | "Edited"
  | "Locked"
  | "Released"
  | "Critical"
  | "Completed";

export type OrderPriority = "High" | "Medium" | "Low";

export type UnplannedOrderType = "Normal" | "Re-delivery" | "Pending";

export type CapacityMetricKey = "casesPct" | "weightPct" | "cbmPct" | "efPct";

export type CostVisibilityRole = Exclude<UserRole, "Viewer">;

export type RouteStopType = "Delivery" | "Collection" | "Re-delivery" | "Service";

export type RouteStopStatus =
  | "Planned"
  | "Sequenced"
  | "Skipped"
  | "Completed";

export type RouteStopSequenceSource = "System" | "Manual";

export interface Depot {
  code: DepotCode;
  name: string;
  geoZone: GeoZoneCode;
  lat: number;
  lng: number;
}

export interface RoutePlan {
  routeNo: string;
  depot: DepotCode;
  tripNo: number;
  vehicle: string;
  vehicleType: string;
  driver: string;
  stops: number;

  /** Reference only. Must not block lock/release by itself. */
  casesPct: number;

  /** Hard capacity check. Blocks lock/release if above 100. */
  weightPct: number;

  /** Hard capacity check. Blocks lock/release if above 100. */
  cbmPct: number;

  /** Hard capacity check. Blocks lock/release if above 100. */
  efPct: number;

  routeHours: number;
  remainingDuty: number;
  status: RouteStatus;

  /** Admin/Planner only. Viewer must not see this. */
  costPerTrip: number;

  /** Admin/Planner only. Viewer must not see this. */
  costPerCase: number;

  /** Admin/Planner only. Viewer must not see this. */
  redeliveryCost: number;

  /** Kept as string[] for this safe first step. Typed warnings come next. */
  warnings: string[];
}

export interface RouteStop {
  /** Stable stop identifier for frontend sequencing. */
  stopId: string;

  /** Links stop back to RoutePlan.routeNo. */
  routeNo: string;

  /** Links stop back to RoutePlan.tripNo. */
  tripNo: number;

  /** Original system-suggested order. */
  plannedSeq: number;

  /** Manual planner order. Null means planner has not changed the sequence. */
  manualSeq: number | null;

  /** Shows whether the active sequence came from the system plan or manual planner edit. */
  sequenceSource: RouteStopSequenceSource;

  customerCode: string;
  customerName: string;
  geoZone: GeoZoneCode;
  stopType: RouteStopType;
  status: RouteStopStatus;

  cases: number;
  serviceMinutes: number;
  plannedEta: string;

  lat: number;
  lng: number;

  /** Driver-facing notes only. No backend/API behavior in this step. */
  notes?: string;
}

export interface RouteStopSequencePlan {
  routeNo: string;
  tripNo: number;
  stops: RouteStop[];
}



export type AssignmentStatus = "Assigned" | "Unassigned";
export type ExportFormat = "CSV";
export type VarianceTone = "On Track" | "Watch" | "Variance";

export interface AssignedOrder {
  orderNo: string;
  routeNo: string;
  tripNo: number;
  customer: string;
  geoZone: GeoZoneCode;
  cases: number;
  status: AssignmentStatus;
}

export interface OrderAssignmentPlan {
  routeNo: string;
  tripNo: number;
  assignedOrders: AssignedOrder[];
}

export interface StopResequenceAuditNote {
  id: string;
  routeNo: string;
  tripNo: number;
  stopId: string;
  action: "Move Up" | "Move Down" | "Manual Sequence";
  note: string;
  createdByRole: UserRole;
  createdAt: string;
}

export interface DriverStopListRow {
  serialNo: number;
  routeNo: string;
  tripNo: number;
  driver: string;
  vehicle: string;
  stopId: string;
  customerCode: string;
  customerName: string;
  cases: number;
  plannedEta: string;
  serviceMinutes: number;
  notes?: string;
}

export interface WarehousePickListRow {
  serialNo: number;
  routeNo: string;
  tripNo: number;
  vehicle: string;
  orderNo: string;
  customer: string;
  itemCode: string;
  itemName: string;
  cases: number;
}

export interface ActualRouteMetric {
  routeNo: string;
  tripNo: number;
  plannedStops: number;
  actualStops: number;
  plannedCases: number;
  actualCases: number;
  plannedHours: number;
  actualHours: number;
  plannedServiceMinutes: number;
  actualServiceMinutes: number;
}

export interface ActualVsPlannedSummary {
  routeNo: string;
  tripNo: number;
  stopVariance: number;
  caseVariance: number;
  hourVariance: number;
  serviceMinuteVariance: number;
  tone: VarianceTone;
}

export interface UnplannedOrder {
  orderNo: string;
  customer: string;
  geoZone: GeoZoneCode;
  cases: number;
  priority: OrderPriority;
  type: UnplannedOrderType;
}

export interface PlanningFilters {
  role: UserRole;
  depot: DepotCode | "ALL";
  geoZone: GeoZoneCode | "ALL";
}

export interface PlanningKpis {
  routes: number;
  critical: number;
  depotUtilizationPct: number;
  unplannedOrders: number;
  tripCost?: number;
}

export interface CapacityValidationResult {
  isValid: boolean;
  isCritical: boolean;
  exceededMetrics: CapacityMetricKey[];
  messages: string[];
}

export type PlanningSnapshotVersion = "routeiq-planning-v1";
export type MapRoutingProvider = "google-maps" | "mapbox" | "openrouteservice";
export type RouteNavigationProvider = "google-maps-app" | "apple-maps-app";
export type DriverStopExecutionStatus = "Pending" | "Arrived" | "Delivered" | "Skipped" | "Failed";
export type GpsSignalStatus = "Online" | "Delayed" | "Offline";
export type EtaConfidence = "High" | "Medium" | "Low";

export interface PlanningSnapshot {
  version: PlanningSnapshotVersion;
  savedAt: string;
  routes: RoutePlan[];
  stopSequencePlans: RouteStopSequencePlan[];
  assignmentPlans: OrderAssignmentPlan[];
  resequencingAuditNotes: StopResequenceAuditNote[];
}

export interface RoutingProviderConfig {
  provider: MapRoutingProvider;
  navigationProvider: RouteNavigationProvider;
  displayName: string;
  planningUseCase: string;
  driverNavigationUseCase: string;
  supportsTrafficAwareEta: boolean;
  supportsRouteMatrix: boolean;
  supportsMultiStopOptimization: boolean;
  requiresServerSideKeyProtection: boolean;
  status: "Selected" | "Fallback" | "Not Selected";
}

export interface DriverWorkflowStop {
  stopId: string;
  routeNo: string;
  tripNo: number;
  sequenceNo: number;
  customerCode: string;
  customerName: string;
  plannedEta: string;
  status: DriverStopExecutionStatus;
  deliveryCases: number;
  proofRequired: boolean;
  navigationProvider: RouteNavigationProvider;
  navigationUrl: string;
  driverNotes?: string;
}

export interface DriverWorkflowSummary {
  routeNo: string;
  tripNo: number;
  totalStops: number;
  pendingStops: number;
  completedStops: number;
  exceptionStops: number;
}

export interface LiveTrackingPoint {
  routeNo: string;
  tripNo: number;
  vehicle: string;
  lat: number;
  lng: number;
  capturedAt: string;
  signalStatus: GpsSignalStatus;
}

export interface LiveEtaSnapshot {
  routeNo: string;
  tripNo: number;
  stopId: string;
  plannedEta: string;
  latestEta: string;
  etaVarianceMinutes: number;
  confidence: EtaConfidence;
  source: "Mock" | "Routing Provider" | "Driver GPS";
}
