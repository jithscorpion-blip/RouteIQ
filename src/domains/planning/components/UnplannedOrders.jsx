function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

/**
 * UnplannedOrders renders the unassigned order panel.
 * Props:
 * - orders: List of orders that are not currently assigned to a planned route.
 */
export function UnplannedOrders({ orders }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h2 className="font-bold text-slate-900 mb-4">Unplanned Orders</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.orderNo} className="border border-slate-100 rounded-xl p-3 hover:border-blue-200">
            <div className="flex justify-between">
              <b className="text-sm">{o.orderNo}</b>
              <span className={classNames(
                "text-xs px-2 py-1 rounded-full",
                o.type === "Re-delivery" ? "bg-purple-100 text-purple-700" :
                o.type === "Pending" ? "bg-orange-100 text-orange-700" :
                "bg-slate-100 text-slate-600"
              )}>{o.type}</span>
            </div>
            <div className="text-sm text-slate-600">{o.customer}</div>
            <div className="text-xs text-slate-400">{o.geoZone} • {o.cases} cases • {o.priority}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
