import { findRouteByKey, getRouteKey, lockRoutePlan, releaseRoutePlan } from "../state/routeWorkflow";
import { assignOrderToRoute, unassignOrderFromRoute } from "../state/orderAssignmentWorkflow";
import { updateStopSequencePlan } from "../state/stopSequenceWorkflow";
import { selectSequencedStopsForRoute } from "../state/stopSequenceSelectors";
import { buildMockEtaSnapshots } from "../telemetry";
import { createMockPlanningStore, type MockPlanningStore } from "./mockDataStore";
import { fail, ok } from "./mockApiResponse";

export const createMockPlanningHandlers = (initialStore: MockPlanningStore = createMockPlanningStore()) => {
  let store = initialStore;

  return {
    getStore: () => store,

    listRoutes: () => ok({ routes: store.routes }),

    getRouteDetail: (routeNo: string, tripNo: number) => {
      const route = store.routes.find((candidate) => candidate.routeNo === routeNo && candidate.tripNo === tripNo);
      if (!route) return fail("ROUTE_NOT_FOUND", "Route was not found.", 404);
      return ok({ route });
    },

    lockRoute: (routeNo: string, tripNo: number) => {
      const route = store.routes.find((candidate) => candidate.routeNo === routeNo && candidate.tripNo === tripNo);
      if (!route) return fail("ROUTE_NOT_FOUND", "Route was not found.", 404);
      store = { ...store, routes: lockRoutePlan(store.routes, route) };
      return ok({ route: findRouteByKey(store.routes, getRouteKey(route)) });
    },

    releaseRoute: (routeNo: string, tripNo: number) => {
      const route = store.routes.find((candidate) => candidate.routeNo === routeNo && candidate.tripNo === tripNo);
      if (!route) return fail("ROUTE_NOT_FOUND", "Route was not found.", 404);
      store = { ...store, routes: releaseRoutePlan(store.routes, route) };
      return ok({ route: findRouteByKey(store.routes, getRouteKey(route)) });
    },

    updateStopSequence: (routeNo: string, tripNo: number, stopId: string, direction: "up" | "down") => {
      store = {
        ...store,
        stopSequencePlans: updateStopSequencePlan(store.stopSequencePlans, routeNo, tripNo, stopId, direction),
      };
      return ok({ stops: selectSequencedStopsForRoute(store.stopSequencePlans, routeNo, tripNo) });
    },

    assignOrder: (routeNo: string, tripNo: number, order: any) => {
      store = {
        ...store,
        assignmentPlans: assignOrderToRoute(store.assignmentPlans, routeNo, tripNo, order),
      };
      return ok({ assignmentPlans: store.assignmentPlans });
    },

    unassignOrder: (routeNo: string, tripNo: number, orderNo: string) => {
      store = {
        ...store,
        assignmentPlans: unassignOrderFromRoute(store.assignmentPlans, routeNo, tripNo, orderNo),
      };
      return ok({ assignmentPlans: store.assignmentPlans });
    },

    getLiveEta: (routeNo: string, tripNo: number) => {
      const stops = selectSequencedStopsForRoute(store.stopSequencePlans, routeNo, tripNo);
      return ok({ etaSnapshots: buildMockEtaSnapshots(stops) });
    },
  };
};
