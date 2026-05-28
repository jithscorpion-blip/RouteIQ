function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function progressColor(value, hard = true) {
  if (!hard) return "bg-slate-500";
  if (value > 100) return "bg-red-500";
  if (value >= 90) return "bg-orange-500";
  return "bg-green-500";
}

/**
 * CapacityBar renders a single utilization bar.
 * Props:
 * - label: Display label shown above the bar.
 * - value: Utilization percentage number.
 * - hard: When true, over-capacity is highlighted as a hard rule violation; when false, it is reference-only.
 */
export function CapacityBar({ label, value, hard = true }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className={classNames("font-semibold", hard && value > 100 ? "text-red-600" : "text-slate-700")}>
          {value}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={classNames("h-full rounded-full", progressColor(value, hard))}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      {!hard && <div className="text-[10px] text-slate-400">Reference only</div>}
    </div>
  );
}
