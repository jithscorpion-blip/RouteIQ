import { getMemoryStore, query, shouldUsePostgres } from "../db/databaseClient.js";

function mapOrderRow(row) {
  return {
    id: row.order_id,
    orderNo: row.order_no,
    customerId: row.customer_id,
    routeId: row.route_id,
    stopId: row.stop_id,
    status: row.status,
    assignmentStatus: row.assignment_status,
    totalCases: Number(row.total_cases ?? 0),
    totalWeightKg: Number(row.total_weight_kg ?? 0),
    totalCbm: Number(row.total_cbm ?? 0),
    totalEf: Number(row.total_ef ?? 0),
    deliveryDate: row.delivery_date,
    updatedAt: row.updated_at,
  };
}

export async function listOrdersRepository() {
  if (!shouldUsePostgres()) return getMemoryStore().orders;

  const result = await query(
    `select order_id, order_no, customer_id, route_id, stop_id, status, assignment_status,
            total_cases, total_weight_kg, total_cbm, total_ef, delivery_date, updated_at
       from planning_orders
      order by delivery_date desc, order_no asc`
  );
  return result.rows.map(mapOrderRow);
}

export async function getOrderByIdRepository(orderId) {
  if (!shouldUsePostgres()) {
    return getMemoryStore().orders.find((item) => item.id === orderId) || null;
  }

  const result = await query(
    `select order_id, order_no, customer_id, route_id, stop_id, status, assignment_status,
            total_cases, total_weight_kg, total_cbm, total_ef, delivery_date, updated_at
       from planning_orders
      where order_id = $1`,
    [orderId]
  );
  return result.rows[0] ? mapOrderRow(result.rows[0]) : null;
}

export async function assignOrderRepository({ orderId, routeId, stopId }) {
  if (!shouldUsePostgres()) {
    const store = getMemoryStore();
    const existing = store.orders.find((item) => item.id === orderId);
    const order = existing || { id: orderId, orderNo: orderId };
    order.routeId = routeId;
    order.stopId = stopId || null;
    order.assignmentStatus = "Assigned";
    order.status = order.status || "Assigned";
    order.updatedAt = new Date().toISOString();
    if (!existing) store.orders.push(order);
    return order;
  }

  const result = await query(
    `update planning_orders
        set route_id = $2,
            stop_id = $3,
            assignment_status = 'Assigned',
            updated_at = now()
      where order_id = $1
      returning order_id, order_no, customer_id, route_id, stop_id, status, assignment_status,
                total_cases, total_weight_kg, total_cbm, total_ef, delivery_date, updated_at`,
    [orderId, routeId, stopId || null]
  );
  return result.rows[0] ? mapOrderRow(result.rows[0]) : null;
}

export async function unassignOrderRepository(orderId) {
  if (!shouldUsePostgres()) {
    const order = getMemoryStore().orders.find((item) => item.id === orderId);
    if (!order) return null;
    order.routeId = null;
    order.stopId = null;
    order.assignmentStatus = "Unassigned";
    order.updatedAt = new Date().toISOString();
    return order;
  }

  const result = await query(
    `update planning_orders
        set route_id = null,
            stop_id = null,
            assignment_status = 'Unassigned',
            updated_at = now()
      where order_id = $1
      returning order_id, order_no, customer_id, route_id, stop_id, status, assignment_status,
                total_cases, total_weight_kg, total_cbm, total_ef, delivery_date, updated_at`,
    [orderId]
  );
  return result.rows[0] ? mapOrderRow(result.rows[0]) : null;
}
