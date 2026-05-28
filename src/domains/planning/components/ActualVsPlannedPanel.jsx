import React from "react";

function toneClass(tone) {
  if (tone === "Variance") return "bg-red-50 text-red-700 border-red-200";
  if (tone === "Watch") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

/**
 * ActualVsPlannedPanel shows read-only execution variance for selected route.
 */
export default function ActualVsPlannedPanel({ summary }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-900">Actual vs Planned</h2>
        <span className={`text-xs px-2 py-1 rounded-full border ${toneClass(summary?.tone)}`}>{summary?.tone ?? "No data"}</span>
      </div>
      {!summary ? (
        <div className="text-sm text-slate-500">No actual execution data available for this route yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 rounded-xl p-3"><b>{summary.stopVariance}</b><div className="text-slate-500">Stop variance</div></div>
          <div className="bg-slate-50 rounded-xl p-3"><b>{summary.caseVariance}</b><div className="text-slate-500">Case variance</div></div>
          <div className="bg-slate-50 rounded-xl p-3"><b>{summary.hourVariance}h</b><div className="text-slate-500">Hour variance</div></div>
          <div className="bg-slate-50 rounded-xl p-3"><b>{summary.serviceMinuteVariance}m</b><div className="text-slate-500">Service variance</div></div>
        </div>
      )}
    </div>
  );
}
