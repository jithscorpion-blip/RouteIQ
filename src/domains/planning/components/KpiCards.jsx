import { UNPLANNED_ORDERS as unplannedOrders } from "../models";
import { selectPlanningKpis } from "../state/selectors";
import { canViewCosts } from "../utils/validation";

/**
 * KpiCards renders the top planning KPI summary row.
 * Props:
 * - visibleRoutes: Routes after current depot/filter selection.
 * - role: Active user role, used to control cost KPI visibility.
 */
export function KpiCards({ visibleRoutes, role }) {
  const kpis = selectPlanningKpis(visibleRoutes, unplannedOrders, role);
  const cards = [
    ["Routes", kpis.routes, "planned trips"],
    ["Critical", kpis.critical, "blocked from release"],
    ["Depot Utilization", `${kpis.depotUtilizationPct}%`, "hard capacity average"],
    ["Unplanned Orders", kpis.unplannedOrders, "awaiting assignment"],
  ];
  if (canViewCosts(role)) cards.push(["Trip Cost", `${(kpis.tripCost || 0).toFixed(1)} OMR`, "Admin / Planner only"]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {cards.map(([label, value, sub]) => (
        <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{value}</div>
          <div className="text-xs text-slate-400 mt-1">{sub}</div>
        </div>
      ))}
    </div>
  );
}
