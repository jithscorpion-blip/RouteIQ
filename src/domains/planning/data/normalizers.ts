/**
 * RouteIQ P2 data normalizers.
 * Converts imported CSV/JSON-shaped data into current frontend planning models.
 */

import type { RoutePlan, UnplannedOrder } from "../types";
import type { ImportedOrderRecord, ImportedRouteRecord } from "./importContracts";

const splitWarnings = (warnings?: string): string[] => {
  if (!warnings) return [];
  return warnings
    .split("|")
    .map((warning) => warning.trim())
    .filter(Boolean);
};

const deriveStatus = (record: ImportedRouteRecord): RoutePlan["status"] => {
  if (record.weightPct > 100 || record.cbmPct > 100 || record.efPct > 100) {
    return "Critical";
  }
  return "Suggested";
};

export const normalizeImportedRoute = (record: ImportedRouteRecord): RoutePlan => ({
  routeNo: record.routeNo,
  depot: record.depot,
  tripNo: Number(record.tripNo),
  vehicle: record.vehicle,
  vehicleType: record.vehicleType,
  driver: record.driver,
  stops: Number(record.stops),
  casesPct: Number(record.casesPct),
  weightPct: Number(record.weightPct),
  cbmPct: Number(record.cbmPct),
  efPct: Number(record.efPct),
  routeHours: Number(record.routeHours),
  remainingDuty: Number(record.remainingDuty),
  status: deriveStatus(record),
  costPerTrip: Number(record.costPerTrip),
  costPerCase: Number(record.costPerCase),
  redeliveryCost: Number(record.redeliveryCost),
  warnings: splitWarnings(record.warnings),
});

export const normalizeImportedRoutes = (records: ImportedRouteRecord[]): RoutePlan[] =>
  records.map(normalizeImportedRoute);

export const normalizeImportedOrder = (record: ImportedOrderRecord): UnplannedOrder => ({
  orderNo: record.orderNo,
  customer: record.customerName,
  geoZone: record.geoZone,
  cases: Number(record.cases),
  priority: record.priority,
  type: record.type,
});

export const normalizeImportedOrders = (records: ImportedOrderRecord[]): UnplannedOrder[] =>
  records.map(normalizeImportedOrder);
