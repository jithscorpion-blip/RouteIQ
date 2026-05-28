import type { RouteRecalculateError, RouteRecalculateRequest, RouteRecalculateResult } from "./routeRecalculateContract";

export type RouteRecalculateResponse =
  | { ok: true; data: RouteRecalculateResult }
  | { ok: false; error: RouteRecalculateError };

export const ROUTE_RECALCULATE_ENDPOINT = "/api/routes/recalculate";

export async function postRouteRecalculate(request: RouteRecalculateRequest): Promise<RouteRecalculateResponse> {
  const response = await fetch(ROUTE_RECALCULATE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      error: payload?.error ?? {
        requestId: request.requestId,
        code: "UNKNOWN_ERROR",
        message: "Route recalculation failed.",
        retryable: true,
      },
    };
  }

  return {
    ok: true,
    data: payload as RouteRecalculateResult,
  };
}

export function getBackendProxyReminder(): string {
  return "Use /api/routes/recalculate as the only browser-facing routing endpoint. Keep Google/Mapbox/OpenRouteService keys on the server side.";
}
