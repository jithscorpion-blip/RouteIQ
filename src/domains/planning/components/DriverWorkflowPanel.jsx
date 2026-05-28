/**
 * DriverWorkflowPanel previews the future mobile driver workflow.
 * Props:
 * - stops: driver workflow stops with navigation links
 * - summary: computed driver workflow summary
 */
export default function DriverWorkflowPanel({ stops = [], summary }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-900">Driver Mobile Workflow</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">Preview</span>
      </div>
      {summary && (
        <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
          <div className="rounded-xl border border-slate-100 p-2"><div className="font-bold text-slate-900">{summary.totalStops}</div><div className="text-slate-400">Stops</div></div>
          <div className="rounded-xl border border-slate-100 p-2"><div className="font-bold text-slate-900">{summary.pendingStops}</div><div className="text-slate-400">Pending</div></div>
          <div className="rounded-xl border border-slate-100 p-2"><div className="font-bold text-slate-900">{summary.completedStops}</div><div className="text-slate-400">Done</div></div>
          <div className="rounded-xl border border-slate-100 p-2"><div className="font-bold text-slate-900">{summary.exceptionStops}</div><div className="text-slate-400">Issues</div></div>
        </div>
      )}
      <div className="space-y-2">
        {stops.slice(0, 4).map((stop) => (
          <div key={stop.stopId} className="border border-slate-100 rounded-xl p-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-800">#{stop.sequenceNo} {stop.customerName}</div>
              <div className="text-xs text-slate-500">ETA {stop.plannedEta} • {stop.deliveryCases} cases • {stop.status}</div>
            </div>
            <a className="text-xs font-semibold text-blue-600" href={stop.navigationUrl} target="_blank" rel="noreferrer">
              Navigate
            </a>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-400">Mobile app will later capture arrival, proof of delivery, skipped-stop reason, and actual service time.</div>
    </div>
  );
}
