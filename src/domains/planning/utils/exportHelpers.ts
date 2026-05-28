/**
 * RouteIQ CSV Export Helpers
 * Frontend-only CSV preparation for driver stop list and warehouse pick list.
 */

import type { DriverStopListRow, RoutePlan, RouteStop, WarehousePickListRow } from "../types";

export function buildDriverStopListRows(route: RoutePlan, stops: RouteStop[]): DriverStopListRow[] {
  return stops.map((stop, index) => ({
    serialNo: index + 1,
    routeNo: route.routeNo,
    tripNo: route.tripNo,
    driver: route.driver,
    vehicle: route.vehicle,
    stopId: stop.stopId,
    customerCode: stop.customerCode,
    customerName: stop.customerName,
    cases: stop.cases,
    plannedEta: stop.plannedEta,
    serviceMinutes: stop.serviceMinutes,
    notes: stop.notes,
  }));
}

export function buildWarehousePickListRows(route: RoutePlan, assignedOrders: any[], pickItems: any[]): WarehousePickListRow[] {
  let serialNo = 1;
  return assignedOrders.flatMap((order) => {
    const lines = pickItems.filter((item) => item.orderNo === order.orderNo);
    const safeLines = lines.length ? lines : [{ orderNo: order.orderNo, itemCode: "MIXED", itemName: "Mixed SKU", cases: order.cases }];
    return safeLines.map((item) => ({
      serialNo: serialNo++,
      routeNo: route.routeNo,
      tripNo: route.tripNo,
      vehicle: route.vehicle,
      orderNo: order.orderNo,
      customer: order.customer,
      itemCode: item.itemCode,
      itemName: item.itemName,
      cases: item.cases,
    }));
  });
}

function escapeCsv(value: unknown): string {
  const text = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(","));
  return [headers.join(","), ...body].join("\n");
}

export function downloadCsv(filename: string, rows: Record<string, unknown>[]): void {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
