/**
 * RouteIQ Order Assignment Selectors
 * Read-only assignment helpers.
 */

import type { OrderAssignmentPlan, UnplannedOrder } from "../types";
import { getRouteSequenceKey } from "./stopSequenceSelectors";

export function selectOrderAssignmentPlan(
  plans: OrderAssignmentPlan[],
  routeNo: string,
  tripNo: number
): OrderAssignmentPlan | undefined {
  return plans.find((plan) => getRouteSequenceKey(plan.routeNo, plan.tripNo) === getRouteSequenceKey(routeNo, tripNo));
}

export function selectAssignedOrdersForRoute(plans: OrderAssignmentPlan[], routeNo: string, tripNo: number) {
  return selectOrderAssignmentPlan(plans, routeNo, tripNo)?.assignedOrders ?? [];
}

export function selectAssignableOrders(orders: UnplannedOrder[], assignedOrderNos: string[] = []) {
  const assigned = new Set(assignedOrderNos);
  return orders.filter((order) => !assigned.has(order.orderNo));
}

export function selectAssignmentSummary(assignedOrders: { cases: number }[], assignableOrders: { cases: number }[]) {
  return {
    assignedOrders: assignedOrders.length,
    assignedCases: assignedOrders.reduce((total, order) => total + order.cases, 0),
    assignableOrders: assignableOrders.length,
    assignableCases: assignableOrders.reduce((total, order) => total + order.cases, 0),
  };
}
