/**
 * LiveEtaPanel previews live ETA / GPS tracking foundation.
 * Props:
 * - trackingPoint: latest vehicle location snapshot
 * - etaSnapshots: ETA snapshots by stop
 * - etaHealth: On Time / Watch / Delayed
 */
export default function LiveEtaPanel({ trackingPoint, etaSnapshots = [], etaHealth }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-slate-900">Live ETA / GPS</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{etaHealth}</span>
      </div>
      {trackingPoint && (
        <div className="text-xs text-slate-500 mb-3">
          Vehicle {trackingPoint.vehicle} • GPS {trackingPoint.signalStatus} • {trackingPoint.lat.toFixed(3)}, {trackingPoint.lng.toFixed(3)}
        </div>
      )}
      <div className="space-y-2">
        {etaSnapshots.slice(0, 3).map((eta) => (
          <div key={eta.stopId} className="grid grid-cols-4 gap-2 text-xs border border-slate-100 rounded-xl p-3">
            <div className="col-span-2 font-semibold text-slate-700">{eta.stopId}</div>
            <div className="text-slate-500">{eta.plannedEta} → {eta.latestEta}</div>
            <div className={eta.etaVarianceMinutes > 5 ? "text-amber-700 font-semibold" : "text-emerald-700 font-semibold"}>
              {eta.etaVarianceMinutes > 0 ? "+" : ""}{eta.etaVarianceMinutes}m
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-400">Currently mock-only. Later connect provider ETA + driver GPS events.</div>
    </div>
  );
}
