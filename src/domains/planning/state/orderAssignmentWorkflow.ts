/**
 * RouteIQ Order Assignment Workflow Helpers
 * Frontend-only assign/unassign helpers. No backend/API/persistence.
 */

import type { AssignedOrder, OrderAssignmentPlan, UnplannedOrder } from "../types";
import { getRouteSequenceKey } from "./stopSequenceSelectors";

function toAssignedOrder(order: UnplannedOrder, routeNo: string, tripNo: number): AssignedOrder {
  return {
    orderNo: order.orderNo,
    routeNo,
    tripNo,
    customer: order.customer,
    geoZone: order.geoZone,
    cases: order.cases,
    status: "Assigned",
  };
}

export function assignOrderToRoute(
  plans: OrderAssignmentPlan[],
  routeNo: string,
  tripNo: number,
  order: UnplannedOrder
): OrderAssignmentPlan[] {
  const key = getRouteSequenceKey(routeNo, tripNo);
  let found = false;
  const next = plans.map((plan) => {
    if (getRouteSequenceKey(plan.routeNo, plan.tripNo) !== key) return plan;
    found = true;
    if (plan.assignedOrders.some((assigned) => assigned.orderNo === order.orderNo)) return plan;
    return { ...plan, assignedOrders: [...plan.assignedOrders, toAssignedOrder(order, routeNo, tripNo)] };
  });
  if (found) return next;
  return [...next, { routeNo, tripNo, assignedOrders: [toAssignedOrder(order, routeNo, tripNo)] }];
}

export function unassignOrderFromRoute(
  plans: OrderAssignmentPlan[],
  routeNo: string,
  tripNo: number,
  orderNo: string
): OrderAssignmentPlan[] {
  const key = getRouteSequenceKey(routeNo, tripNo);
  return plans.map((plan) => {
    if (getRouteSequenceKey(plan.routeNo, plan.tripNo) !== key) return plan;
    return { ...plan, assignedOrders: plan.assignedOrders.filter((order) => order.orderNo !== orderNo) };
  });
}

export function getAssignedOrderNos(plans: OrderAssignmentPlan[]): string[] {
  return plans.flatMap((plan) => plan.assignedOrders.map((order) => order.orderNo));
}
