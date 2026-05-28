import React from "react";
import { DEPOTS as depots, USER_ROLES as roles } from "../models";

/**
 * Header renders the top planner controls.
 * Props:
 * - role: Active user role selected in the role dropdown.
 * - setRole: Callback to update the active user role.
 * - depot: Active depot filter value.
 * - setDepot: Callback to update the active depot filter.
 */
export default function Header({ role, setRole, depot, setDepot }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">RouteIQ Planner</h1>
        <p className="text-sm text-slate-500">Multi-depot FMCG route planning control tower</p>
      </div>
      <div className="flex items-center gap-3">
        <select className="border rounded-xl px-3 py-2 text-sm bg-white">
          <option>2026-05-28</option>
        </select>
        <select className="border rounded-xl px-3 py-2 text-sm bg-white" value={depot} onChange={(e) => setDepot(e.target.value)}>
          <option value="ALL">All Depots</option>
          {depots.map((d) => <option key={d.code} value={d.code}>{d.name}</option>)}
        </select>
        <select className="border rounded-xl px-3 py-2 text-sm bg-white">
          <option>All Geo Zones</option>
          <option>MCT</option>
          <option>SOH</option>
          <option>BRK</option>
        </select>
        <select className="border rounded-xl px-3 py-2 text-sm bg-white" value={role} onChange={(e) => setRole(e.target.value)}>
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
    </header>
  );
}
