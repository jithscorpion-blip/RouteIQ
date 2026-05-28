import { ROUTES, UNPLANNED_ORDERS } from "../../models";

export const mockPlanningClient = {
  listRoutes: async () => ROUTES,
  listOrders: async () => UNPLANNED_ORDERS,
  assignOrder: async (payload: { orderId: string; routeId: string }) => ({ ...payload, mode: "mock" }),
  unassignOrder: async (payload: { orderId: string }) => ({ ...payload, mode: "mock" }),
  recalculateRoute: async (payload: { routeId: string; stops?: unknown[] }) => ({
    ...payload,
    provider: "mock",
    status: "not-executed",
  }),
};
