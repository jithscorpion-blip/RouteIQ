import React from "react";

/**
 * ExportPanel exposes frontend CSV exports for driver and warehouse teams.
 */
export default function ExportPanel({ driverRows, pickRows, onExportDriver, onExportPick }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
      <h2 className="font-bold text-slate-900">Route Outputs</h2>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-50 rounded-xl p-3"><b>{driverRows.length}</b><div className="text-slate-500">Driver stop rows</div></div>
        <div className="bg-slate-50 rounded-xl p-3"><b>{pickRows.length}</b><div className="text-slate-500">Warehouse pick rows</div></div>
      </div>
      <div className="flex gap-3">
        <button type="button" onClick={onExportDriver} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold">Export Driver CSV</button>
        <button type="button" onClick={onExportPick} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Export Pick CSV</button>
      </div>
    </div>
  );
}
