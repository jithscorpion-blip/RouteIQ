import { validateImportRows } from "../importValidation/index.js";
import { getMemoryStore, persistMemoryStore } from "../db/databaseClient.js";

const ENTITY_ORDER = ["customers", "vehicles", "routes", "orders"];

function normalizeRow(row) {
  return Object.fromEntries(Object.entries(row || {}).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]));
}

function buildSet(rows, key) {
  return new Set((rows || []).map((row) => String(row?.[key] || "").trim()).filter(Boolean));
}

function pushIssue(issues, rowNumber, field, message) {
  issues.push({ rowNumber, field, message });
}

export function validatePilotImportBundle(files = {}) {
  const normalizedFiles = {};
  const entityResults = {};
  const bundleErrors = [];
  const bundleWarnings = [];

  for (const entityName of ENTITY_ORDER) {
    const rows = Array.isArray(files?.[entityName]) ? files[entityName].map(normalizeRow) : [];
    normalizedFiles[entityName] = rows;
    entityResults[entityName] = validateImportRows(entityName, rows);
    if (rows.length === 0) {
      pushIssue(bundleWarnings, 0, entityName, `${entityName} file was not supplied. Import can still be committed as partial pilot data.`);
    }
  }

  const customers = normalizedFiles.customers;
  const vehicles = normalizedFiles.vehicles;
  const routes = normalizedFiles.routes;
  const orders = normalizedFiles.orders;
  const customerCodes = buildSet(customers, "customerCode");
  const vehicleCodes = buildSet(vehicles, "vehicleCode");
  const routeIds = buildSet(routes, "routeId");

  const seenCustomerCodes = new Set();
  customers.forEach((row, index) => {
    const code = row.customerCode;
    if (!code) return;
    if (seenCustomerCodes.has(code)) pushIssue(bundleErrors, index + 1, "customerCode", `Duplicate customer code: ${code}.`);
    seenCustomerCodes.add(code);
  });

  const seenOrderNos = new Set();
  orders.forEach((row, index) => {
    const orderNo = row.orderNo;
    if (orderNo) {
      if (seenOrderNos.has(orderNo)) pushIssue(bundleErrors, index + 1, "orderNo", `Duplicate order number: ${orderNo}.`);
      seenOrderNos.add(orderNo);
    }
    if (row.customerCode && customerCodes.size > 0 && !customerCodes.has(row.customerCode)) {
      pushIssue(bundleErrors, index + 1, "customerCode", `Order customer ${row.customerCode} is missing from customer master.`);
    }
    if (row.routeId && routeIds.size > 0 && !routeIds.has(row.routeId)) {
      pushIssue(bundleErrors, index + 1, "routeId", `Order route ${row.routeId} is missing from route master.`);
    }
  });

  routes.forEach((row, index) => {
    if (row.vehicleCode && vehicleCodes.size > 0 && !vehicleCodes.has(row.vehicleCode)) {
      pushIssue(bundleErrors, index + 1, "vehicleCode", `Route vehicle ${row.vehicleCode} is missing from vehicle master.`);
    }
  });

  const entityErrors = Object.values(entityResults).flatMap((result) => result.errors || []);
  const ok = entityErrors.length === 0 && bundleErrors.length === 0;
  const totalRows = Object.values(normalizedFiles).reduce((sum, rows) => sum + rows.length, 0);
  const validRows = Object.values(entityResults).reduce((sum, result) => sum + result.validRows, 0);

  return {
    ok,
    totalRows,
    validRows,
    normalizedFiles,
    entityResults,
    bundleErrors,
    bundleWarnings,
    checkedAt: new Date().toISOString(),
  };
}

export async function commitPilotImportBundle({ files, user, source = "admin-upload" }) {
  const validation = validatePilotImportBundle(files);
  if (!validation.ok) {
    return {
      ok: false,
      committed: false,
      validation,
      message: "Pilot import was not committed because validation failed.",
    };
  }

  const store = getMemoryStore();
  store.customers = validation.normalizedFiles.customers;
  store.vehicles = validation.normalizedFiles.vehicles;
  store.importedRoutes = validation.normalizedFiles.routes;
  store.importedOrders = validation.normalizedFiles.orders;
  store.importBatches = store.importBatches || [];

  const batch = {
    id: `import-${Date.now()}`,
    source,
    committedAt: new Date().toISOString(),
    committedBy: user?.name || user?.id || "unknown",
    role: user?.role || "unknown",
    rows: {
      customers: store.customers.length,
      vehicles: store.vehicles.length,
      routes: store.importedRoutes.length,
      orders: store.importedOrders.length,
    },
    totalRows: validation.totalRows,
  };
  store.importBatches.unshift(batch);
  await persistMemoryStore();

  return {
    ok: true,
    committed: true,
    batch,
    validation,
    message: "Pilot import committed to RouteIQ local/staging data store.",
  };
}

export async function listImportHistory() {
  return getMemoryStore().importBatches || [];
}
