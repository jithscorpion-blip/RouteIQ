import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./csvParser.js";
import { validateImportRows } from "../importValidation/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "../..");
const pilotDataDir = path.join(projectRoot, "staging", "pilot-data");
const outputDir = path.join(pilotDataDir, "generated");

const PILOT_FILES = [
  { entityName: "customers", fileName: "customers_sample.csv", mapper: mapCustomerRow },
  { entityName: "orders", fileName: "orders_sample.csv", mapper: mapOrderRow },
  { entityName: "vehicles", fileName: "vehicles_sample.csv", mapper: mapVehicleRow },
  { entityName: "routes", fileName: "routes_sample.csv", mapper: mapRouteRow },
];

function num(value) {
  if (value === undefined || value === null || String(value).trim() === "") return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
}

function first(row, keys, fallback = "") {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") return row[key];
  }
  return fallback;
}

function mapCustomerRow(row) {
  return {
    customerCode: first(row, ["customerCode", "customer_code", "code"]),
    customerName: first(row, ["customerName", "customer_name", "name"]),
    depotCode: first(row, ["depotCode", "depot_code", "depot"]),
    geoZone: first(row, ["geoZone", "geo_zone", "zone"]),
    latitude: num(first(row, ["latitude", "lat"])),
    longitude: num(first(row, ["longitude", "lng", "lon"])),
    serviceMinutes: num(first(row, ["serviceMinutes", "service_minutes"])),
    priority: first(row, ["priority"]),
  };
}

function mapOrderRow(row) {
  return {
    orderNo: first(row, ["orderNo", "order_no", "orderId", "order_id"]),
    customerCode: first(row, ["customerCode", "customer_code"]),
    depotCode: first(row, ["depotCode", "depot_code", "depot"]),
    cases: num(first(row, ["cases", "case_qty"])),
    weightKg: num(first(row, ["weightKg", "weight_kg", "weight"])),
    cbm: num(first(row, ["cbm"])),
    priority: first(row, ["priority"]),
    deliveryWindow: first(row, ["deliveryWindow", "delivery_window"]),
  };
}

function mapVehicleRow(row) {
  return {
    vehicleCode: first(row, ["vehicleCode", "vehicle_code"]),
    vehicleName: first(row, ["vehicleName", "vehicle_name", "name"], first(row, ["vehicleCode", "vehicle_code"])),
    depotCode: first(row, ["depotCode", "depot_code", "depot"]),
    maxWeightKg: num(first(row, ["maxWeightKg", "max_weight_kg", "capacity_weight_kg"])),
    maxCbm: num(first(row, ["maxCbm", "max_cbm", "capacity_cbm"])),
    maxEf: num(first(row, ["maxEf", "max_ef", "ef_capacity"], 100)),
  };
}

function mapRouteRow(row) {
  return {
    routeId: first(row, ["routeId", "route_id", "route", "routeNo", "route_no"]),
    depot: first(row, ["depot", "depotCode", "depot_code"]),
    vehicleCode: first(row, ["vehicleCode", "vehicle_code"]),
    driverName: first(row, ["driverName", "driver_name", "driver"]),
    plannedKm: num(first(row, ["plannedKm", "planned_km", "km"])),
    plannedMinutes: num(first(row, ["plannedMinutes", "planned_minutes", "minutes"])),
  };
}

function readRows(fileName, mapper) {
  const filePath = path.join(pilotDataDir, fileName);
  if (!fs.existsSync(filePath)) {
    return { fileName, found: false, rawRows: [], rows: [] };
  }
  const rawRows = parseCsv(fs.readFileSync(filePath, "utf8"));
  return { fileName, found: true, rawRows, rows: rawRows.map(mapper) };
}

export function runPilotDataImportWorkflow() {
  const startedAt = new Date().toISOString();
  const entities = PILOT_FILES.map(({ entityName, fileName, mapper }) => {
    const fileResult = readRows(fileName, mapper);
    const validation = fileResult.found
      ? validateImportRows(entityName, fileResult.rows)
      : {
          ok: false,
          entityName,
          totalRows: 0,
          validRows: 0,
          errors: [{ rowNumber: 0, field: "file", message: `${fileName} was not found.` }],
          warnings: [],
        };

    return {
      entityName,
      fileName,
      found: fileResult.found,
      totalRows: fileResult.rows.length,
      validRows: validation.validRows,
      ok: validation.ok,
      validation,
      previewRows: fileResult.rows.slice(0, 5),
    };
  });

  const summary = {
    ok: entities.every((entity) => entity.ok),
    startedAt,
    completedAt: new Date().toISOString(),
    mode: "validate-only-no-database-write",
    sourceDirectory: pilotDataDir,
    totals: {
      entities: entities.length,
      rows: entities.reduce((sum, entity) => sum + entity.totalRows, 0),
      validRows: entities.reduce((sum, entity) => sum + entity.validRows, 0),
      errors: entities.reduce((sum, entity) => sum + entity.validation.errors.length, 0),
      warnings: entities.reduce((sum, entity) => sum + entity.validation.warnings.length, 0),
    },
    entities,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "pilot-import-preview.json"), JSON.stringify(summary, null, 2));
  fs.writeFileSync(
    path.join(outputDir, "pilot-import-summary.txt"),
    [
      `RouteIQ P42 Pilot Import Workflow`,
      `Mode: ${summary.mode}`,
      `Status: ${summary.ok ? "PASS" : "FAIL"}`,
      `Rows: ${summary.totals.validRows}/${summary.totals.rows} valid`,
      `Errors: ${summary.totals.errors}`,
      `Warnings: ${summary.totals.warnings}`,
      `Preview: staging/pilot-data/generated/pilot-import-preview.json`,
    ].join("\n")
  );

  return summary;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const summary = runPilotDataImportWorkflow();
  console.log(JSON.stringify({ ok: summary.ok, totals: summary.totals }, null, 2));
  process.exit(summary.ok ? 0 : 1);
}
