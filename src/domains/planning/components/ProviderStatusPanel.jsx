/**
 * ProviderStatusPanel documents the selected planning/navigation provider choice.
 * Props:
 * - provider: selected RoutingProviderConfig
 */
export default function ProviderStatusPanel({ provider }) {
  if (!provider) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-slate-900">Routing Provider</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          {provider.status}
        </span>
      </div>
      <div className="text-sm font-semibold text-slate-800">{provider.displayName}</div>
      <p className="text-xs text-slate-500 mt-2">{provider.planningUseCase}</p>
      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
        <div className="rounded-xl border border-slate-100 p-3">
          <div className="text-slate-400">Traffic ETA</div>
          <div className="font-semibold text-slate-800">{provider.supportsTrafficAwareEta ? "Supported" : "Limited"}</div>
        </div>
        <div className="rounded-xl border border-slate-100 p-3">
          <div className="text-slate-400">Route Matrix</div>
          <div className="font-semibold text-slate-800">{provider.supportsRouteMatrix ? "Supported" : "Limited"}</div>
        </div>
      </div>
      {provider.requiresServerSideKeyProtection && (
        <div className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
          API keys must be protected server-side before production use.
        </div>
      )}
    </div>
  );
}
