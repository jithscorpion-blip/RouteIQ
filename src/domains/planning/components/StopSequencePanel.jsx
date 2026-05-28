import React from "react";
import { getSequenceDeltaLabel } from "../state/stopSequenceWorkflow";

/**
 * StopSequencePanel shows route stops in active sequence order.
 * Props:
 * - route: Selected route.
 * - stops: Sequenced stops for the selected route.
 * - summary: Stop sequence summary.
 * - canEdit: Enables manual move controls.
 * - onMoveUp/onMoveDown: Controlled sequencing callbacks.
 */
export default function StopSequencePanel({ route, stops, summary, canEdit = false, onMoveUp, onMoveDown }) {
  if (!route) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Stop Sequence</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
          {summary?.hasManualChanges ? "Manual edited" : "System sequence"}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-50 rounded-xl p-3"><b>{summary?.totalStops ?? 0}</b><div className="text-slate-500">Stops</div></div>
        <div className="bg-slate-50 rounded-xl p-3"><b>{summary?.totalCases ?? 0}</b><div className="text-slate-500">Cases</div></div>
        <div className="bg-slate-50 rounded-xl p-3"><b>{summary?.totalServiceMinutes ?? 0}m</b><div className="text-slate-500">Service</div></div>
      </div>

      <div className="space-y-2">
        {stops.length === 0 && <div className="text-sm text-slate-500">No stop sequence available for this route yet.</div>}
        {stops.map((stop, index) => (
          <div key={stop.stopId} className="border border-slate-100 rounded-xl p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">#{index + 1} {stop.customerName}</div>
                <div className="text-xs text-slate-500">{stop.customerCode} • {stop.cases} cases • ETA {stop.plannedEta}</div>
                <div className="text-xs text-slate-400">{stop.stopType} • {stop.serviceMinutes}m service • {getSequenceDeltaLabel(stop)}</div>
              </div>
              {canEdit && (
                <div className="flex gap-1">
                  <button type="button" onClick={() => onMoveUp?.(stop.stopId)} disabled={index === 0} className="px-2 py-1 rounded-lg border text-xs disabled:text-slate-300">↑</button>
                  <button type="button" onClick={() => onMoveDown?.(stop.stopId)} disabled={index === stops.length - 1} className="px-2 py-1 rounded-lg border text-xs disabled:text-slate-300">↓</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
