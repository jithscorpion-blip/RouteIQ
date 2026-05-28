import {
  ACTUAL_ROUTE_METRICS,
  ROUTE_ORDER_ASSIGNMENT_PLANS,
  ROUTE_STOP_SEQUENCE_PLANS,
  ROUTES,
  UNPLANNED_ORDERS,
} from "../models";

export const createMockPlanningStore = () => ({
  routes: [...ROUTES],
  unplannedOrders: [...UNPLANNED_ORDERS],
  stopSequencePlans: [...ROUTE_STOP_SEQUENCE_PLANS],
  assignmentPlans: [...ROUTE_ORDER_ASSIGNMENT_PLANS],
  actualRouteMetrics: [...ACTUAL_ROUTE_METRICS],
});

export type MockPlanningStore = ReturnType<typeof createMockPlanningStore>;
