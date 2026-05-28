import { getImportSchema } from "./importSchemas.js";

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

function isNumeric(value) {
  return hasValue(value) && Number.isFinite(Number(value));
}

export function validateImportRows(entityName, rows) {
  const schema = getImportSchema(entityName);
  const errors = [];
  const warnings = [];

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
    schema.requiredFields.forEach((field) => {
      if (!hasValue(row?.[field])) errors.push({ rowNumber, field, message: `${field} is required.` });
    });
    schema.numericFields.forEach((field) => {
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
