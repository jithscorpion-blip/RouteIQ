import { createApiError } from "../errors/apiErrors.js";

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isNumberLike(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function optionalNumber(value) {
  return value === undefined || value === null || isNumberLike(value);
}

function validateRequiredString(payload, field, errors) {
  if (!isNonEmptyString(payload?.[field])) {
    errors.push({ field, message: `${field} is required.` });
  }
}

function validateOptionalNumber(payload, field, errors) {
  if (!optionalNumber(payload?.[field])) {
    errors.push({ field, message: `${field} must be a number when provided.` });
  }
}

export function assertValidPayload(payload, validatorName) {
  const errors = [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createApiError("VALIDATION_FAILED", [{ field: "body", message: "Request body must be a JSON object." }]);
  }

  switch (validatorName) {
    case "upsertRoute":
      validateRequiredString(payload, "id", errors);
      validateOptionalNumber(payload, "plannedKm", errors);
      validateOptionalNumber(payload, "plannedMinutes", errors);
      validateOptionalNumber(payload, "totalCases", errors);
      validateOptionalNumber(payload, "totalWeightKg", errors);
      validateOptionalNumber(payload, "totalCbm", errors);
      validateOptionalNumber(payload, "totalEf", errors);
      validateOptionalNumber(payload, "estimatedCost", errors);
      break;

    case "recalculateRoute":
      validateRequiredString(payload, "routeId", errors);
      if (payload.stops !== undefined && !Array.isArray(payload.stops)) {
        errors.push({ field: "stops", message: "stops must be an array when provided." });
      }
      break;

    case "assignOrder":
      validateRequiredString(payload, "orderId", errors);
      validateRequiredString(payload, "routeId", errors);
      break;

    case "unassignOrder":
      validateRequiredString(payload, "orderId", errors);
      break;

    case "telemetryLocation":
      validateRequiredString(payload, "routeId", errors);
      validateOptionalNumber(payload, "speedKph", errors);
      validateOptionalNumber(payload, "heading", errors);
      if (!isNumberLike(payload.latitude)) errors.push({ field: "latitude", message: "latitude must be a number." });
      if (!isNumberLike(payload.longitude)) errors.push({ field: "longitude", message: "longitude must be a number." });
      break;

    default:
      errors.push({ field: "validator", message: `Unknown validator: ${validatorName}` });
      break;
  }

  if (errors.length > 0) {
    throw createApiError("VALIDATION_FAILED", errors);
  }

  return payload;
}
