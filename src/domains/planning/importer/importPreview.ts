import type { ImportedCustomerRecord, ImportedOrderRecord, ImportedRouteRecord, ImportedVehicleRecord } from "../data/importContracts";

export type ImportPreviewInput = {
  customers?: ImportedCustomerRecord[];
  orders?: ImportedOrderRecord[];
  routes?: ImportedRouteRecord[];
  vehicles?: ImportedVehicleRecord[];
};

export type ImportPreviewSummary = {
  customers: number;
  orders: number;
  routes: number;
  vehicles: number;
  warnings: string[];
};

export const buildImportPreviewSummary = (input: ImportPreviewInput): ImportPreviewSummary => {
  const customers = input.customers?.length ?? 0;
  const orders = input.orders?.length ?? 0;
  const routes = input.routes?.length ?? 0;
  const vehicles = input.vehicles?.length ?? 0;
  const warnings: string[] = [];

  if (orders > 0 && customers === 0) warnings.push("Orders were provided without customer master data.");
  if (routes > 0 && vehicles === 0) warnings.push("Routes were provided without vehicle master data.");
  if (customers + orders + routes + vehicles === 0) warnings.push("No import records were detected.");

  return { customers, orders, routes, vehicles, warnings };
};
