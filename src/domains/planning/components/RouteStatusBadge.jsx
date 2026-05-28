function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function statusClass(status) {
  const map = {
    Suggested: "bg-blue-50 text-blue-700 border-blue-200",
    Edited: "bg-purple-50 text-purple-700 border-purple-200",
    Locked: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Released: "bg-green-50 text-green-700 border-green-200",
    Critical: "bg-red-50 text-red-700 border-red-200",
    Completed: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return map[status] || "bg-slate-50 text-slate-700 border-slate-200";
}

/**
 * RouteStatusBadge renders the visual status pill for a route.
 * Props:
 * - status: Current route planning status, such as Suggested, Edited, Locked, Released, Critical, or Completed.
 */
export function RouteStatusBadge({ status }) {
  return (
    <span className={classNames("px-3 py-1 rounded-full border text-xs font-semibold", statusClass(status))}>
      {status}
    </span>
  );
}
