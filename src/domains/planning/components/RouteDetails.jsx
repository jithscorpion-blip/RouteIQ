import React from "react";
import { canManageRoutes, canViewCosts, isHardCapacityExceeded } from "../utils/validation";
import { canLockRoute, canReleaseRoute } from "../state/routeWorkflow";
import { CapacityBar } from "./CapacityBar";
import { RouteStatusBadge } from "./RouteStatusBadge";

/**
 * RouteDetails renders the selected route detail panel.
 * Props:
 * - route: Currently selected route object; returns null when no route is selected.
 * - role: Active user role, used to control cost visibility and route actions.
 * - onLock: Callback fired when the selected route is locked.
 * - onRelease: Callback fired when the selected route is released.
 */
export function RouteDetails({ route, role, onLock, onRelease }) {
  if (!route) return null;
  const hardCritical = isHardCapacityExceeded(route);
  const canManage = canManageRoutes(role);
  const lockDisabled = !canLockRoute(route);
  const releaseDisabled = !canReleaseRoute(route);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">{route.routeNo} / Trip {route.tripNo}</h2>
        <RouteStatusBadge status={route.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><span className="text-slate-500">Depot:</span> <b>{route.depot}</b></div>
        <div><span className="text-slate-500">Vehicle:</span> <b>{route.vehicle}</b></div>
        <div><span className="text-slate-500">Driver:</span> <b>{route.driver}</b></div>
        <div><span className="text-slate-500">Remaining Duty:</span> <b>{route.remainingDuty}h</b></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CapacityBar label="Cases % / Reference Only" value={route.casesPct} hard={false} />
        <CapacityBar label="Weight % / Hard Check" value={route.weightPct} />
        <CapacityBar label="CBM % / Hard Check" value={route.cbmPct} />
        <CapacityBar label="EF % / Hard Check" value={route.efPct} />
      </div>

      {hardCritical && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          Critical route: cannot be locked or released. {route.warnings.join(", ") || "Hard capacity exceeded."}
        </div>
      )}

      {canManage && (
        <div className="flex gap-3 pt-3 border-t">
          <button
            type="button"
            onClick={() => onLock?.(route)}
            disabled={lockDisabled}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Lock Route
          </button>
          <button
            type="button"
            onClick={() => onRelease?.(route)}
            disabled={releaseDisabled}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Release Route
          </button>
        </div>
      )}

      {canViewCosts(role) && (
        <div className="grid grid-cols-3 gap-3 pt-3 border-t">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500">Trip Cost</div>
            <div className="font-bold">{route.costPerTrip.toFixed(3)} OMR</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500">Cost / Case</div>
            <div className="font-bold">{route.costPerCase.toFixed(3)} OMR</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-500">Re-delivery Cost</div>
            <div className="font-bold">{route.redeliveryCost.toFixed(3)} OMR</div>
          </div>
        </div>
      )}
    </div>
  );
}
