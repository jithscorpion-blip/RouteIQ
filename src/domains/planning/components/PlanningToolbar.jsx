import React from "react";

/**
 * PlanningToolbar renders the static planning action/filter toolbar.
 * Props: none.
 */
export default function PlanningToolbar() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between">
      <div className="flex flex-wrap gap-3">
        <select className="border rounded-xl px-3 py-2 text-sm"><option>Driver Mode: Both</option></select>
        <select className="border rounded-xl px-3 py-2 text-sm"><option>Planning Mode: Balanced</option></select>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" defaultChecked /> Multi-trip enabled
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Run Planning</button>
        <button className="px-4 py-2 rounded-xl border text-sm font-semibold">Re-optimize</button>
        <button className="px-4 py-2 rounded-xl border text-sm font-semibold">Lock Routes</button>
        <button className="px-4 py-2 rounded-xl border text-sm font-semibold">Release Dispatch</button>
      </div>
    </div>
  );
}
