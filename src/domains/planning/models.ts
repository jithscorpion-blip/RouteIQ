/**
 * RouteIQ Planning Domain Models / Mock Data
 *
 * This file extracts static planning-domain data from RouteIQPrototype.jsx.
 * It intentionally does not change UI behavior or connect to APIs.
 */

import type { ActualRouteMetric, Depot, OrderAssignmentPlan, RoutePlan, RouteStopSequencePlan, UnplannedOrder, UserRole } from "./types";

export const USER_ROLES: UserRole[] = ["Admin", "Planner", "Viewer"];

export const DEPOTS: Depot[] = [
  { code: "MCT-DC", name: "Muscat DC", geoZone: "MCT", lat: 23.588, lng: 58.382 },
  { code: "SOH-DC", name: "Sohar Depot", geoZone: "SOH", lat: 24.347, lng: 56.707 },
  { code: "BRK-DC", name: "Barka Depot", geoZone: "BRK", lat: 23.707, lng: 57.886 },
];

export const ROUTES: RoutePlan[] = [
  {
    routeNo: "RT-001",
    depot: "MCT-DC",
    tripNo: 1,
    vehicle: "VH-102",
    vehicleType: "3 Ton Truck",
    driver: "Mohammed Ali",
    stops: 18,
    casesPct: 126,
    weightPct: 91,
    cbmPct: 84,
    efPct: 88,
    routeHours: 7.2,
    remainingDuty: 2.8,
    status: "Suggested",
    costPerTrip: 42.6,
    costPerCase: 0.168,
    redeliveryCost: 0.0,
    warnings: [],
  },
  {
    routeNo: "RT-002",
    depot: "MCT-DC",
    tripNo: 1,
    vehicle: "VH-118",
    vehicleType: "Van",
    driver: "Saeed Khan",
    stops: 14,
    casesPct: 104,
    weightPct: 103,
    cbmPct: 79,
    efPct: 82,
    routeHours: 8.9,
    remainingDuty: 0.6,
    status: "Critical",
    costPerTrip: 39.8,
    costPerCase: 0.212,
    redeliveryCost: 0.28,
    warnings: ["Weight exceeded by 240 KG"],
  },
  {
    routeNo: "RT-003",
    depot: "SOH-DC",
    tripNo: 1,
    vehicle: "VH-221",
    vehicleType: "Chiller",
    driver: "Rashid Omar",
    stops: 11,
    casesPct: 88,
    weightPct: 76,
    cbmPct: 94,
    efPct: 98,
    routeHours: 5.4,
    remainingDuty: 4.1,
    status: "Edited",
    costPerTrip: 51.2,
    costPerCase: 0.196,
    redeliveryCost: 0.12,
    warnings: ["Near EF capacity"],
  },
  {
    routeNo: "RT-003",
    depot: "SOH-DC",
    tripNo: 2,
    vehicle: "VH-221",
    vehicleType: "Chiller",
    driver: "Rashid Omar",
    stops: 7,
    casesPct: 64,
    weightPct: 58,
    cbmPct: 66,
    efPct: 61,
    routeHours: 3.1,
    remainingDuty: 0.7,
    status: "Suggested",
    costPerTrip: 27.5,
    costPerCase: 0.181,
    redeliveryCost: 0.0,
    warnings: [],
  },
];

export const UNPLANNED_ORDERS: UnplannedOrder[] = [
  { orderNo: "ORD-2031", customer: "ABC Hypermarket", geoZone: "MCT", cases: 55, priority: "High", type: "Normal" },
  { orderNo: "ORD-2034", customer: "Seeb Grocery", geoZone: "MCT", cases: 26, priority: "Medium", type: "Re-delivery" },
  { orderNo: "ORD-2042", customer: "Sohar Cafe", geoZone: "SOH", cases: 18, priority: "Low", type: "Pending" },
];


/**
 * Manual stop sequencing model seed data.
 *
 * Data-model only: not connected to UI, reducers, drag/drop, backend, or APIs yet.
 * The active sequence is derived later from manualSeq when planner sequencing is enabled.
 */
export const ROUTE_STOP_SEQUENCE_PLANS: RouteStopSequencePlan[] = [
  {
    routeNo: "RT-001",
    tripNo: 1,
    stops: [
      {
        stopId: "STOP-RT001-001",
        routeNo: "RT-001",
        tripNo: 1,
        plannedSeq: 1,
        manualSeq: null,
        sequenceSource: "System",
        customerCode: "CUS-MCT-001",
        customerName: "ABC Hypermarket",
        geoZone: "MCT",
        stopType: "Delivery",
        status: "Planned",
        cases: 42,
        serviceMinutes: 18,
        plannedEta: "08:35",
        lat: 23.590,
        lng: 58.405,
        notes: "Main receiving gate",
      },
      {
        stopId: "STOP-RT001-002",
        routeNo: "RT-001",
        tripNo: 1,
        plannedSeq: 2,
        manualSeq: null,
        sequenceSource: "System",
        customerCode: "CUS-MCT-002",
        customerName: "Seeb Grocery",
        geoZone: "MCT",
        stopType: "Delivery",
        status: "Planned",
        cases: 28,
        serviceMinutes: 12,
        plannedEta: "09:10",
        lat: 23.625,
        lng: 58.220,
      },
      {
        stopId: "STOP-RT001-003",
        routeNo: "RT-001",
        tripNo: 1,
        plannedSeq: 3,
        manualSeq: null,
        sequenceSource: "System",
        customerCode: "CUS-MCT-003",
        customerName: "Qurum Mini Market",
        geoZone: "MCT",
        stopType: "Delivery",
        status: "Planned",
        cases: 31,
        serviceMinutes: 15,
        plannedEta: "09:55",
        lat: 23.610,
        lng: 58.490,
      },
    ],
  },
  {
    routeNo: "RT-002",
    tripNo: 1,
    stops: [
      {
        stopId: "STOP-RT002-001",
        routeNo: "RT-002",
        tripNo: 1,
        plannedSeq: 1,
        manualSeq: null,
        sequenceSource: "System",
        customerCode: "CUS-MCT-011",
        customerName: "Ruwi Wholesale",
        geoZone: "MCT",
        stopType: "Delivery",
        status: "Planned",
        cases: 36,
        serviceMinutes: 20,
        plannedEta: "08:45",
        lat: 23.596,
        lng: 58.545,
        notes: "Weight-sensitive stop",
      },
      {
        stopId: "STOP-RT002-002",
        routeNo: "RT-002",
        tripNo: 1,
        plannedSeq: 2,
        manualSeq: null,
        sequenceSource: "System",
        customerCode: "CUS-MCT-012",
        customerName: "Muttrah Cold Store",
        geoZone: "MCT",
        stopType: "Re-delivery",
        status: "Planned",
        cases: 22,
        serviceMinutes: 14,
        plannedEta: "09:30",
        lat: 23.620,
        lng: 58.565,
      },
    ],
  },
  {
    routeNo: "RT-003",
    tripNo: 1,
    stops: [
      {
        stopId: "STOP-RT003-001",
        routeNo: "RT-003",
        tripNo: 1,
        plannedSeq: 1,
        manualSeq: null,
        sequenceSource: "System",
        customerCode: "CUS-SOH-001",
        customerName: "Sohar Cafe",
        geoZone: "SOH",
        stopType: "Delivery",
        status: "Planned",
        cases: 18,
        serviceMinutes: 10,
        plannedEta: "10:15",
        lat: 24.345,
        lng: 56.735,
      },
    ],
  },
];


/**
 * Order assignment seed data.
 * Frontend-only: no backend/API or persistence.
 */
export const ROUTE_ORDER_ASSIGNMENT_PLANS: OrderAssignmentPlan[] = [
  {
    routeNo: "RT-001",
    tripNo: 1,
    assignedOrders: [
      { orderNo: "ORD-1001", routeNo: "RT-001", tripNo: 1, customer: "ABC Hypermarket", geoZone: "MCT", cases: 42, status: "Assigned" },
      { orderNo: "ORD-1002", routeNo: "RT-001", tripNo: 1, customer: "Seeb Grocery", geoZone: "MCT", cases: 28, status: "Assigned" },
    ],
  },
  {
    routeNo: "RT-002",
    tripNo: 1,
    assignedOrders: [
      { orderNo: "ORD-1011", routeNo: "RT-002", tripNo: 1, customer: "Ruwi Wholesale", geoZone: "MCT", cases: 36, status: "Assigned" },
    ],
  },
];

/**
 * Minimal warehouse pick seed data for frontend CSV output.
 */
export const ROUTE_PICK_ITEMS = [
  { orderNo: "ORD-1001", itemCode: "WTR-200ML", itemName: "Water 200ml", cases: 22 },
  { orderNo: "ORD-1001", itemCode: "WTR-500ML", itemName: "Water 500ml", cases: 20 },
  { orderNo: "ORD-1002", itemCode: "WTR-500ML", itemName: "Water 500ml", cases: 28 },
  { orderNo: "ORD-1011", itemCode: "WTR-1.5L", itemName: "Water 1.5L", cases: 36 },
];

/**
 * Planned vs actual seed data.
 * Frontend-only foundation for variance monitoring.
 */
export const ACTUAL_ROUTE_METRICS: ActualRouteMetric[] = [
  {
    routeNo: "RT-001",
    tripNo: 1,
    plannedStops: 18,
    actualStops: 16,
    plannedCases: 101,
    actualCases: 96,
    plannedHours: 7.2,
    actualHours: 7.8,
    plannedServiceMinutes: 45,
    actualServiceMinutes: 58,
  },
  {
    routeNo: "RT-002",
    tripNo: 1,
    plannedStops: 14,
    actualStops: 12,
    plannedCases: 58,
    actualCases: 49,
    plannedHours: 8.9,
    actualHours: 9.4,
    plannedServiceMinutes: 34,
    actualServiceMinutes: 46,
  },
];
