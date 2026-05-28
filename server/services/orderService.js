import {
  assignOrderRepository,
  getOrderByIdRepository,
  listOrdersRepository,
  unassignOrderRepository,
} from "../repositories/orderRepository.js";
import { recordAuditEvent } from "./auditService.js";

export async function listOrders() {
  return listOrdersRepository();
}

export async function assignOrder({ orderId, routeId, stopId }, user) {
  const before = await getOrderByIdRepository(orderId);
  const order = await assignOrderRepository({ orderId, routeId, stopId });
  if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404, code: "ORDER_NOT_FOUND" });
  await recordAuditEvent({ actorId: user.id, action: "order.assign", entityType: "order", entityId: orderId, before, after: order });
  return order;
}

export async function unassignOrder(orderId, user) {
  const before = await getOrderByIdRepository(orderId);
  const order = await unassignOrderRepository(orderId);
  if (!order) throw Object.assign(new Error("Order not found"), { statusCode: 404, code: "ORDER_NOT_FOUND" });
  await recordAuditEvent({ actorId: user.id, action: "order.unassign", entityType: "order", entityId: orderId, before, after: order });
  return order;
}
