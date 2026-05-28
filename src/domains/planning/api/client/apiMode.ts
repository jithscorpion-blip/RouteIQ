export type PlanningApiMode = "mock" | "backend";

export function getPlanningApiMode(): PlanningApiMode {
  const value = import.meta.env?.VITE_ROUTEIQ_API_MODE;
  return value === "backend" ? "backend" : "mock";
}

export function getPlanningApiBaseUrl(): string {
  return import.meta.env?.VITE_ROUTEIQ_API_BASE_URL || "";
}

export function getPlanningApiToken(): string {
  return import.meta.env?.VITE_ROUTEIQ_API_TOKEN || "dev-admin-token";
}
