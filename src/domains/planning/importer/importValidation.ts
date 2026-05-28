export type ImportEntityName = "customers" | "orders" | "routes" | "vehicles";

export type ImportValidationIssue = {
  rowNumber: number;
  field: string;
  message: string;
};

export type ImportValidationResult = {
  ok: boolean;
  entityName: ImportEntityName;
  totalRows: number;
  validRows: number;
  errors: ImportValidationIssue[];
  warnings: ImportValidationIssue[];
};

export const IMPORT_REQUIRED_FIELDS: Record<ImportEntityName, string[]> = {
  customers: ["customerCode", "customerName", "latitude", "longitude"],
  orders: ["orderNo", "customerCode", "cases", "weightKg", "cbm"],
  routes: ["routeId", "depot", "vehicleCode", "driverName"],
  vehicles: ["vehicleCode", "vehicleName", "maxWeightKg", "maxCbm"],
};

export const IMPORT_NUMERIC_FIELDS: Record<ImportEntityName, string[]> = {
  customers: ["latitude", "longitude"],
  orders: ["cases", "weightKg", "cbm"],
  routes: ["plannedKm", "plannedMinutes"],
  vehicles: ["maxWeightKg", "maxCbm", "maxEf"],
};

const hasValue = (value: unknown) => value !== undefined && value !== null && String(value).trim() !== "";
const isNumeric = (value: unknown) => hasValue(value) && Number.isFinite(Number(value));

export function validateImportedRows(entityName: ImportEntityName, rows: Record<string, string | number | null | undefined>[]): ImportValidationResult {
  const errors: ImportValidationIssue[] = [];
  const warnings: ImportValidationIssue[] = [];

  if (!Array.isArray(rows)) {
    return {
      ok: false,
      entityName,
      totalRows: 0,
      validRows: 0,
      errors: [{ rowNumber: 0, field: "rows", message: "Rows must be an array." }],
      warnings,
    };
  }

  rows.forEach((row, index) => {
    const rowNumber = index + 1;
    IMPORT_REQUIRED_FIELDS[entityName].forEach((field) => {
      if (!hasValue(row?.[field])) errors.push({ rowNumber, field, message: `${field} is required.` });
    });
    IMPORT_NUMERIC_FIELDS[entityName].forEach((field) => {
      if (hasValue(row?.[field]) && !isNumeric(row[field])) {
        errors.push({ rowNumber, field, message: `${field} must be numeric.` });
      }
    });
  });

  if (rows.length === 0) warnings.push({ rowNumber: 0, field: "rows", message: "No rows detected for import." });
  const invalidRows = new Set(errors.map((error) => error.rowNumber).filter(Boolean));

  return {
    ok: errors.length === 0,
    entityName,
    totalRows: rows.length,
    validRows: Math.max(rows.length - invalidRows.size, 0),
    errors,
    warnings,
  };
}
