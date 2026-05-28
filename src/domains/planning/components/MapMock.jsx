import React from "react";

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

/**
 * MapMock renders the current prototype map placeholder.
 * Props:
 * - selected: Currently selected route, used only to display the depot context.
 */
export default function MapMock({ selected }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-bold text-slate-900">Interactive Planning Map</h2>
          <p className="text-xs text-slate-500">Mock map: depot markers, route lines, draggable order pins concept</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">Mock Mode</span>
      </div>
      <div className="relative h-[420px] rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden border">
        <div className="absolute left-8 top-8 bg-slate-950 text-white text-xs px-3 py-2 rounded-xl shadow">Depot: {selected?.depot || "MCT-DC"}</div>
        <div className="absolute left-24 top-32 w-64 h-1 bg-blue-500 rotate-12 rounded-full" />
        <div className="absolute left-72 top-44 w-52 h-1 bg-green-500 -rotate-12 rounded-full" />
        <div className="absolute left-44 top-60 w-72 h-1 bg-orange-500 rotate-6 rounded-full" />
        {[["Stop 1", 160, 140], ["Stop 2", 330, 190], ["Stop 3", 430, 310], ["Unplanned", 250, 350]].map(([label, x, y], i) => (
          <div key={label} className="absolute" style={{ left: x, top: y }}>
            <div className={classNames("w-5 h-5 rounded-full border-4 border-white shadow", label === "Unplanned" ? "bg-purple-500" : "bg-blue-600")} />
            <div className="mt-1 text-[10px] bg-white rounded px-2 py-1 shadow">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
