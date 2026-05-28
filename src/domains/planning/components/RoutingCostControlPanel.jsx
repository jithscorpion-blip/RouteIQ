/**
 * RoutingCostControlPanel shows the cost-control policy for routing API usage.
 * Props:
 * - policy: RoutingCostPolicy
 * - estimate: RoutingUsageEstimate | null
 * - cacheKey: current route cache key preview
 */
export default function RoutingCostControlPanel({ policy, estimate, cacheKey }) {
  if (!policy) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-slate-900">Routing Cost Control</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          {policy.mode}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="rounded-xl border border-slate-100 p-3">
          <div className="text-slate-400">API on screen load</div>
          <div className="font-semibold text-slate-800">{policy.allowApiOnScreenLoad ? "Allowed" : "Blocked"}</div>
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <div className="text-slate-400">API on route select</div>
          <div className="font-semibold text-slate-800">{policy.allowApiOnRouteSelect ? "Allowed" : "Blocked"}</div>
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <div className="text-slate-400">Traffic ETA</div>
          <div className="font-semibold text-slate-800">{policy.allowTrafficAwareEta ? "On demand" : "Off"}</div>
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <div className="text-slate-400">Cache TTL</div>
          <div className="font-semibold text-slate-800">{policy.cacheTtlMinutes} min</div>
        </div>
      </div>

      {estimate && (
        <div className="rounded-xl border border-slate-100 p-3 text-xs mb-3">
          <div className="flex justify-between">
            <span className="text-slate-400">Selected route</span>
            <span className="font-semibold text-slate-800">{estimate.routeKey}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-slate-400">Stops</span>
            <span className="font-semibold text-slate-800">{estimate.stopCount}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-slate-400">Planning calls</span>
            <span className="font-semibold text-slate-800">{estimate.estimatedPlanningCalls}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-slate-400">Driver navigation links</span>
            <span className="font-semibold text-slate-800">{estimate.estimatedNavigationCalls}</span>
          </div>
          {estimate.warning && <div className="mt-2 text-amber-700 bg-amber-50 rounded-lg p-2">{estimate.warning}</div>}
        </div>
      )}

      <div className="text-[11px] text-slate-400 break-all mb-3">Cache key: {cacheKey || "No selected route"}</div>

      <ul className="space-y-1 text-xs text-slate-500 list-disc pl-4">
        {policy.notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
