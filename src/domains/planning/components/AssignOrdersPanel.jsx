import React from "react";

/**
 * AssignOrdersPanel manages controlled frontend assignment of unplanned orders to selected route.
 */
export default function AssignOrdersPanel({ route, assignedOrders, assignableOrders, summary, canEdit, onAssign, onUnassign }) {
  if (!route) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Order Assignment</h2>
        <span className="text-xs text-slate-500">{summary.assignedOrders} assigned • {summary.assignableOrders} open</span>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-500 mb-2">Assigned to {route.routeNo} / Trip {route.tripNo}</div>
        <div className="space-y-2">
          {assignedOrders.length === 0 && <div className="text-sm text-slate-500">No orders assigned yet.</div>}
          {assignedOrders.map((order) => (
            <div key={order.orderNo} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
              <div>
                <div className="text-sm font-semibold">{order.orderNo}</div>
                <div className="text-xs text-slate-500">{order.customer} • {order.cases} cases</div>
              </div>
              {canEdit && <button type="button" onClick={() => onUnassign?.(order.orderNo)} className="text-xs px-3 py-1 rounded-lg border">Unassign</button>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-slate-500 mb-2">Available unplanned orders</div>
        <div className="space-y-2">
          {assignableOrders.length === 0 && <div className="text-sm text-slate-500">No assignable orders remaining.</div>}
          {assignableOrders.map((order) => (
            <div key={order.orderNo} className="flex items-center justify-between border border-slate-100 rounded-xl p-3">
              <div>
                <div className="text-sm font-semibold">{order.orderNo}</div>
                <div className="text-xs text-slate-500">{order.customer} • {order.geoZone} • {order.cases} cases</div>
              </div>
              {canEdit && <button type="button" onClick={() => onAssign?.(order)} className="text-xs px-3 py-1 rounded-lg bg-slate-900 text-white">Assign</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
