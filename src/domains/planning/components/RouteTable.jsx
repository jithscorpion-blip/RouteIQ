import React from "react";
import { CapacityBar } from "./CapacityBar";
import { RouteStatusBadge } from "./RouteStatusBadge";

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

/**
 * RouteTable renders the planned routes grid.
 * Props:
 * - visibleRoutes: Routes after current filter selection.
 * - selected: Currently selected route.
 * - setSelected: Callback fired when a route row is clicked.
 * - role: Active user role retained for future permission-aware table behavior.
 */
export default function RouteTable({ visibleRoutes, selected, setSelected, role }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Planned Routes</h2>
        <span className="text-xs text-slate-500">Cases = reference only | Weight, CBM, EF = hard checks</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {["Route", "Depot", "Trip", "Vehicle", "Driver", "Stops", "Cases", "Weight", "CBM", "EF", "Hours", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRoutes.map((r, idx) => (
              <tr
                key={`${r.routeNo}-${r.tripNo}`}
                onClick={() => setSelected(r)}
                className={classNames(
                  "border-t border-slate-100 cursor-pointer hover:bg-blue-50/40",
                  selected?.routeNo === r.routeNo && selected?.tripNo === r.tripNo ? "bg-blue-50" : ""
                )}
              >
                <td className="px-4 py-3 font-semibold">{r.routeNo}</td>
                <td className="px-4 py-3">{r.depot}</td>
                <td className="px-4 py-3">Trip {r.tripNo}</td>
                <td className="px-4 py-3">{r.vehicle}</td>
                <td className="px-4 py-3">{r.driver}</td>
                <td className="px-4 py-3">{r.stops}</td>
                <td className="px-4 py-3 min-w-28"><CapacityBar label="" value={r.casesPct} hard={false} /></td>
                <td className="px-4 py-3 min-w-28"><CapacityBar label="" value={r.weightPct} /></td>
                <td className="px-4 py-3 min-w-28"><CapacityBar label="" value={r.cbmPct} /></td>
                <td className="px-4 py-3 min-w-28"><CapacityBar label="" value={r.efPct} /></td>
                <td className="px-4 py-3">{r.routeHours}h</td>
                <td className="px-4 py-3">
                  <RouteStatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
