import { getPlanningApiMode } from "./apiMode";
import { backendPlanningClient } from "./backendPlanningClient";
import { mockPlanningClient } from "./mockPlanningClient";

export function getPlanningApiClient() {
  return getPlanningApiMode() === "backend" ? backendPlanningClient : mockPlanningClient;
}

export const planningApiClient = getPlanningApiClient();
