function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

/**
 * Sidebar renders the static RouteIQ navigation menu.
 * Props: none.
 */
export default function Sidebar() {
  const items = ["Dashboard", "Daily Orders", "Planning", "Routes", "Dispatch", "Masters", "Reports", "Settings"];

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen p-5">
      <div className="text-2xl font-bold tracking-tight mb-8">RouteIQ</div>
      <nav className="space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className={classNames(
              "px-4 py-3 rounded-xl text-sm font-medium cursor-default",
              item === "Planning" ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-900"
            )}
          >
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}
