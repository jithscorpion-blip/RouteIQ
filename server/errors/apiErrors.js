export const API_ERROR_CODES = {
  VALIDATION_FAILED: {
    code: "VALIDATION_FAILED",
    statusCode: 400,
    message: "Request validation failed.",
  },
  INVALID_JSON_BODY: {
    code: "INVALID_JSON_BODY",
    statusCode: 400,
    message: "Invalid JSON body.",
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    statusCode: 401,
    message: "Authentication is required.",
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    statusCode: 403,
    message: "The current user does not have permission for this action.",
  },
  ROUTE_NOT_FOUND: {
    code: "ROUTE_NOT_FOUND",
    statusCode: 404,
    message: "Route not found.",
  },
  ORDER_NOT_FOUND: {
    code: "ORDER_NOT_FOUND",
    statusCode: 404,
    message: "Order not found.",
  },
  ENDPOINT_NOT_FOUND: {
    code: "ENDPOINT_NOT_FOUND",
    statusCode: 404,
    message: "RouteIQ endpoint not found.",
  },
  DATABASE_UNAVAILABLE: {
    code: "DATABASE_UNAVAILABLE",
    statusCode: 503,
    message: "Database is unavailable.",
  },
  ROUTING_PROVIDER_UNAVAILABLE: {
    code: "ROUTING_PROVIDER_UNAVAILABLE",
    statusCode: 503,
    message: "Routing provider is unavailable.",
  },
  ROUTEIQ_SERVER_ERROR: {
    code: "ROUTEIQ_SERVER_ERROR",
    statusCode: 500,
    message: "Unexpected RouteIQ server error.",
  },
};

export function createApiError(code, details = undefined, overrideMessage = undefined) {
  const catalogEntry = API_ERROR_CODES[code] || API_ERROR_CODES.ROUTEIQ_SERVER_ERROR;
  const error = new Error(overrideMessage || catalogEntry.message);
  error.code = catalogEntry.code;
  error.statusCode = catalogEntry.statusCode;
  if (details !== undefined) error.details = details;
  return error;
}

export function normalizeApiError(error) {
  const catalogEntry = API_ERROR_CODES[error?.code] || null;
  const statusCode = error?.statusCode || catalogEntry?.statusCode || 500;
  const code = error?.code || catalogEntry?.code || "ROUTEIQ_SERVER_ERROR";
  const message = error?.message || catalogEntry?.message || API_ERROR_CODES.ROUTEIQ_SERVER_ERROR.message;

  return {
    statusCode,
    payload: {
      ok: false,
      error: {
        code,
        message,
        details: error?.details,
      },
    },
  };
}
