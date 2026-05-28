/**
 * DriverMobileScreen is a mobile-first route execution prototype component.
 * It is not connected to auth, backend persistence, or live GPS yet.
 */
export function DriverMobileScreen({ route, summary, onArrive, onComplete, onException }) {
  return (
    <div className="bg-slate-950 text-white rounded-3xl p-4 shadow-sm max-w-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-slate-400">Driver Route</div>
          <h2 className="text-xl font-bold">{route?.routeNo || "No route"} / Trip {route?.tripNo || "-"}</h2>
          <p className="text-xs text-slate-400">Vehicle {route?.vehicle || "-"}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          {summary?.completed ?? 0}/{summary?.totalStops ?? 0} done
        </span>
      </div>
      <div className="space-y-3">
        {(route?.stops || []).map((stop) => (
          <div key={stop.stopId} className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <div className="flex justify-between gap-3">
              <div>
                <div className="text-xs text-slate-400">Stop {stop.sequence}</div>
                <div className="font-semibold">{stop.customerName}</div>
                <div className="text-xs text-slate-400">{stop.plannedArrival || "Planned time pending"}</div>
              </div>
              <span className="text-xs text-slate-300 capitalize">{stop.status}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
              <button onClick={() => onArrive?.(stop.stopId)} className="rounded-xl bg-white/10 py-2">Arrive</button>
              <button onClick={() => onComplete?.(stop.stopId)} className="rounded-xl bg-emerald-500/20 text-emerald-200 py-2">Done</button>
              <button onClick={() => onException?.(stop.stopId)} className="rounded-xl bg-amber-500/20 text-amber-200 py-2">Issue</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
