/**
 * RouteIQ Productization P2 — real data import contracts.
 *
 * Frontend-only foundation for CSV/JSON route, order, customer, and vehicle data.
 * No backend, API, persistence, routing provider, or workflow behavior is added here.
 */

import type { DepotCode, GeoZoneCode, OrderPriority, UnplannedOrderType } from "../types";

export interface ImportedCustomerRecord {
  customerCode: string;
  customerName: string;
  geoZone: GeoZoneCode;
  depot: DepotCode;
  latitude: number;
  longitude: number;
  serviceMinutes: number;
  deliveryWindowStart?: string;
  deliveryWindowEnd?: string;
  notes?: string;
}

export interface ImportedOrderRecord {
  orderNo: string;
  customerCode: string;
  customerName: string;
  geoZone: GeoZoneCode;
  depot: DepotCode;
  cases: number;
  weightKg: number;
  cbm: number;
  priority: OrderPriority;
  type: UnplannedOrderType;
  requestedDeliveryDate?: string;
}

export interface ImportedRouteRecord {
  routeNo: string;
  depot: DepotCode;
  tripNo: number;
  vehicle: string;
  vehicleType: string;
  driver: string;
  stops: number;
  casesPct: number;
  weightPct: number;
  cbmPct: number;
  efPct: number;
  routeHours: number;
  remainingDuty: number;
  costPerTrip: number;
  costPerCase: number;
  redeliveryCost: number;
  warnings?: string;
}

export interface ImportedVehicleRecord {
  vehicle: string;
  depot: DepotCode;
  vehicleType: string;
  maxWeightKg: number;
  maxCbm: number;
  maxCases?: number;
  driver?: string;
  active: boolean;
}

export const CUSTOMER_CSV_HEADERS = [
  "customerCode",
  "customerName",
  "geoZone",
  "depot",
  "latitude",
  "longitude",
  "serviceMinutes",
  "deliveryWindowStart",
  "deliveryWindowEnd",
  "notes",
] as const;

export const ORDER_CSV_HEADERS = [
  "orderNo",
  "customerCode",
  "customerName",
  "geoZone",
  "depot",
  "cases",
  "weightKg",
  "cbm",
  "priority",
  "type",
  "requestedDeliveryDate",
] as const;

export const ROUTE_CSV_HEADERS = [
  "routeNo",
  "depot",
  "tripNo",
  "vehicle",
  "vehicleType",
  "driver",
  "stops",
  "casesPct",
  "weightPct",
  "cbmPct",
  "efPct",
  "routeHours",
  "remainingDuty",
  "costPerTrip",
  "costPerCase",
  "redeliveryCost",
  "warnings",
] as const;

export const VEHICLE_CSV_HEADERS = [
  "vehicle",
  "depot",
  "vehicleType",
  "maxWeightKg",
  "maxCbm",
  "maxCases",
  "driver",
  "active",
] as const;
