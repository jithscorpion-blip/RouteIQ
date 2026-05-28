import { getPlanningApiBaseUrl, getPlanningApiToken } from "./apiMode";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getPlanningApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getPlanningApiToken()}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error?.message || `RouteIQ API request failed: ${path}`);
  }
  return payload?.data ?? payload;
}

export const backendPlanningClient = {
  listRoutes: () => request("/api/routes"),
  listOrders: () => request("/api/orders"),
  assignOrder: (payload: { orderId: string; routeId: string }) =>
    request("/api/orders/assign", { method: "POST", body: JSON.stringify(payload) }),
  unassignOrder: (payload: { orderId: string }) =>
    request("/api/orders/unassign", { method: "POST", body: JSON.stringify(payload) }),
  recalculateRoute: (payload: { routeId: string; stops?: unknown[] }) =>
    request("/api/routes/recalculate", { method: "POST", body: JSON.stringify(payload) }),
};
