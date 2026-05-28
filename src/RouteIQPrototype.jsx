import React, { useMemo, useState } from "react";
import {
  ACTUAL_ROUTE_METRICS,
  ROUTE_ORDER_ASSIGNMENT_PLANS,
  ROUTE_PICK_ITEMS,
  ROUTE_STOP_SEQUENCE_PLANS,
  ROUTES,
  UNPLANNED_ORDERS,
} from "./domains/planning/models";
import { canManageRoutes } from "./domains/planning/utils/validation";
import { createDemoSession, loadRouteIqSession, saveRouteIqSession, clearRouteIqSession } from "./domains/planning/auth";
import { demoLogin, routeIqApi } from "./domains/planning/api/backendClient";
import { createPlanningSnapshot, loadPlanningSnapshot, savePlanningSnapshot } from "./domains/planning/persistence";
import {
  getSelectedRoutingProvider,
  ROUTEIQ_ROUTING_COST_POLICY,
  estimateRoutingUsage,
  getRouteCacheKey,
} from "./domains/planning/routing";
import { buildDriverWorkflowStops, selectDriverWorkflowSummary } from "./domains/planning/mobile";
import { buildMockEtaSnapshots, buildMockTrackingPoint, selectEtaHealth } from "./domains/planning/telemetry";
import { buildDriverStopListRows, buildWarehousePickListRows, downloadCsv } from "./domains/planning/utils/exportHelpers";
import { selectVisibleRoutes } from "./domains/planning/state/selectors";
import { getRouteKey, findRouteByKey, lockRoutePlan, releaseRoutePlan } from "./domains/planning/state/routeWorkflow";
import { selectSequencedStopsForRoute, selectStopSequenceSummary } from "./domains/planning/state/stopSequenceSelectors";
import { updateStopSequencePlan, createResequenceAuditNote } from "./domains/planning/state/stopSequenceWorkflow";
import { getAssignedOrderNos, assignOrderToRoute, unassignOrderFromRoute } from "./domains/planning/state/orderAssignmentWorkflow";
import { selectAssignableOrders, selectAssignedOrdersForRoute, selectAssignmentSummary } from "./domains/planning/state/orderAssignmentSelectors";
import { selectActualMetricForRoute, selectActualVsPlannedSummary } from "./domains/planning/state/actualVsPlannedSelectors";
import {
  ActualVsPlannedPanel,
  AssignOrdersPanel,
  AuthSessionPanel,
  ExportPanel,
  Header,
  ImportDataPanel,
  KpiCards,
  MapMock,
  PlanningToolbar,
  ProviderStatusPanel,
  RoutingCostControlPanel,
  DriverWorkflowPanel,
  DriverMobileScreen,
  LiveEtaPanel,
  RouteDetails,
  RouteTable,
  StopSequencePanel,
  UnplannedOrders,
} from "./domains/planning/components";


const MODULES = [
  { id: "planning", label: "Planning", status: "Working", tone: "emerald", icon: "▦" },
  { id: "admin-upload", label: "Admin Upload", status: "Partial", tone: "blue", icon: "⇧" },
  { id: "routes", label: "Routes", status: "Shell", tone: "amber", icon: "↬" },
  { id: "orders", label: "Orders", status: "Shell", tone: "amber", icon: "◫" },
  { id: "warehouse", label: "Warehouse Pick List", status: "Planned", tone: "slate", icon: "▤" },
  { id: "driver", label: "Driver View", status: "Foundation", tone: "blue", icon: "▣" },
  { id: "actual", label: "Actual vs Planned", status: "Foundation", tone: "blue", icon: "◎" },
  { id: "tracking", label: "Live Tracking", status: "Foundation", tone: "blue", icon: "⌖" },
  { id: "reports", label: "Reports / KPIs", status: "Planned", tone: "slate", icon: "◈" },
  { id: "settings", label: "Settings", status: "Shell", tone: "amber", icon: "⚙" },
];

const MODULE_DETAILS = {
  routes: {
    title: "Routes",
    status: "Shell",
    purpose: "Manage planned route masters, trip status, route locking, and planner-controlled route readiness.",
    features: ["Route list by depot and delivery date", "Route lock / release workflow", "Vehicle and driver assignment", "Capacity and territory exceptions", "Route recalculation history"],
    value: "Gives dispatch teams a controlled daily route board instead of spreadsheet-based route ownership.",
    nextStep: "Connect this shell to the existing route endpoints and route state already used by the Planning dashboard.",
  },
  orders: {
    title: "Orders",
    status: "Shell",
    purpose: "Control daily delivery orders before and after route assignment.",
    features: ["Unplanned order queue", "Assigned vs unassigned order view", "Bulk route assignment", "Order exception flags", "Customer/territory validation"],
    value: "Reduces missed orders, wrong route allocation, and last-minute manual coordination.",
    nextStep: "Expose the existing unplanned and assigned order logic as a dedicated Orders module.",
  },
  warehouse: {
    title: "Warehouse Pick List",
    status: "Planned",
    purpose: "Generate route-wise and item-wise picking sheets for warehouse loading and dispatch readiness.",
    features: ["Route-wise pick list", "Item-wise consolidated pick list", "Stop-wise loading sequence", "Driver loading manifest", "Excel/PDF export"],
    value: "Aligns planning with warehouse execution and reduces loading errors before dispatch.",
    nextStep: "Use the existing export helper foundation to build a dedicated printable/exportable pick list screen.",
  },
  driver: {
    title: "Driver View",
    status: "Foundation",
    purpose: "Give drivers a mobile-first route list with stop sequence, customer details, and navigation links.",
    features: ["Today route view", "Stop-by-stop sequence", "Google/Apple navigation links", "Start/complete stop actions", "Failed delivery reason and POD planned"],
    value: "Turns the plan into controlled field execution and creates the base for actual vs planned monitoring.",
    nextStep: "Expand the existing driver workflow panel into a mobile-style module with stop action buttons.",
  },
  actual: {
    title: "Actual vs Planned",
    status: "Foundation",
    purpose: "Compare planned route performance against real execution timestamps and service times.",
    features: ["Planned vs actual arrival", "Planned vs actual service time", "Delay variance", "Wrong master data detection", "Driver productivity trends"],
    value: "Shows where the operation is losing time and helps correct route assumptions using real evidence.",
    nextStep: "Connect driver stop events to the actual vs planned model and dashboard cards.",
  },
  tracking: {
    title: "Live Tracking",
    status: "Foundation",
    purpose: "Track vehicles on route using driver GPS pings and live ETA snapshots.",
    features: ["Driver GPS ping", "Live vehicle marker", "ETA refresh", "Delay alerts", "Off-route exception planned"],
    value: "Creates supervisor visibility and reduces repeated calls to drivers for location updates.",
    nextStep: "Connect phone GPS permissions and backend telemetry storage to the existing telemetry endpoints.",
  },
  reports: {
    title: "Reports / KPIs",
    status: "Planned",
    purpose: "Provide management-level logistics KPIs across route productivity, fleet utilization, and delivery discipline.",
    features: ["Cost per case", "Vehicle utilization", "OTIF", "Failed delivery rate", "Route completion and delay trends"],
    value: "Converts daily dispatch activity into management visibility and continuous improvement.",
    nextStep: "Create KPI cards from persisted route, order, and execution data after database wiring.",
  },
  settings: {
    title: "Settings",
    status: "Shell",
    purpose: "Manage users, roles, depots, system configuration, and future API/provider settings.",
    features: ["Admin/planner/viewer roles", "Future driver role", "Depot configuration", "Map provider settings", "Import template controls"],
    value: "Prepares RouteIQ for controlled multi-user operation and future tenant/company separation.",
    nextStep: "Replace demo session switching with production authentication and user-role management.",
  },
};

const STATUS_BADGE_CLASS = {
  Working: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Partial: "bg-blue-50 text-blue-700 border-blue-100",
  Foundation: "bg-blue-50 text-blue-700 border-blue-100",
  Shell: "bg-amber-50 text-amber-700 border-amber-100",
  Planned: "bg-slate-50 text-slate-600 border-slate-200",
};

function StatusBadge({ status }) {
  return <span className={`text-[11px] px-2 py-1 rounded-full border ${STATUS_BADGE_CLASS[status] || STATUS_BADGE_CLASS.Planned}`}>{status}</span>;
}

function AppNavigation({ activeModule, setActiveModule }) {
  return (
    <aside className="w-72 bg-slate-950 text-white min-h-screen border-r border-slate-800 sticky top-0 self-start hidden lg:flex flex-col">
      <div className="p-5 border-b border-slate-800">
        <div className="text-xs uppercase tracking-[0.24em] text-blue-300">RouteIQ</div>
        <div className="text-xl font-black mt-1">Control Tower</div>
        <div className="text-xs text-slate-400 mt-2">P44 module shell • MVP staging prototype</div>
      </div>
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {MODULES.map((module) => {
          const active = activeModule === module.id;
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => setActiveModule(module.id)}
              className={`w-full text-left rounded-2xl px-3 py-3 transition border ${
                active ? "bg-blue-600 border-blue-400 shadow-lg shadow-blue-950/40" : "bg-transparent border-transparent hover:bg-slate-900 hover:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? "bg-white/15" : "bg-slate-900"}`}>{module.icon}</span>
                  <span className="font-semibold text-sm truncate">{module.label}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${active ? "bg-white/10 border-white/20 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}>
                  {module.status}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        Visible now: Planning + Admin Upload. Other modules are structured shells for controlled next builds.
      </div>
    </aside>
  );
}

function MobileModuleTabs({ activeModule, setActiveModule }) {
  return (
    <div className="lg:hidden bg-slate-950 p-3 overflow-x-auto flex gap-2">
      {MODULES.map((module) => (
        <button
          key={module.id}
          type="button"
          onClick={() => setActiveModule(module.id)}
          className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs border ${activeModule === module.id ? "bg-blue-600 text-white border-blue-400" : "bg-slate-900 text-slate-300 border-slate-800"}`}
        >
          {module.label}
        </button>
      ))}
    </div>
  );
}

function ProjectStatusBanner({ activeModule, syncStatus, onSyncSnapshot }) {
  const current = MODULES.find((module) => module.id === activeModule);
  return (
    <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white p-5 shadow-sm border border-slate-800">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-blue-300">RouteIQ product checkpoint</div>
          <h1 className="text-2xl font-black mt-1">{current?.label || "Planning"}</h1>
          <p className="text-sm text-slate-300 mt-1">Current checkpoint P43 • Active milestone P44 • MVP / staging prototype • Not production-ready yet</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
            <div className="text-slate-300">Planning</div><div className="font-bold text-emerald-300">Working</div>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
            <div className="text-slate-300">Admin Upload</div><div className="font-bold text-blue-300">Built</div>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
            <div className="text-slate-300">Database</div><div className="font-bold text-amber-300">Pending</div>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
            <div className="text-slate-300">Next</div><div className="font-bold text-white">Pick List / Deploy</div>
          </div>
          <button type="button" onClick={onSyncSnapshot} className="rounded-2xl bg-emerald-500/20 border border-emerald-300/30 p-3 text-left hover:bg-emerald-500/30">
            <div className="text-slate-300">Server sync</div><div className="font-bold text-emerald-200">{syncStatus || "Save now"}</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function ModuleShell({ moduleId }) {
  const detail = MODULE_DETAILS[moduleId] || MODULE_DETAILS.routes;
  return (
    <div className="grid grid-cols-12 gap-5">
      <section className="col-span-12 xl:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Module shell</div>
            <h2 className="text-2xl font-black text-slate-900 mt-1">{detail.title}</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-3xl">{detail.purpose}</p>
          </div>
          <StatusBadge status={detail.status} />
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {detail.features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{feature}</div>
            </div>
          ))}
        </div>
      </section>
      <aside className="col-span-12 xl:col-span-4 space-y-5">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">Business value</h3>
          <p className="text-sm text-slate-500 mt-2">{detail.value}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-900">Next implementation step</h3>
          <p className="text-sm text-slate-500 mt-2">{detail.nextStep}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5">
          <h3 className="font-bold text-amber-900">Status note</h3>
          <p className="text-sm text-amber-700 mt-2">This module is intentionally a structured shell in P44. It makes the product navigation complete without falsely presenting pending workflows as production-ready.</p>
        </div>
      </aside>
    </div>
  );
}


function MiniMetric({ label, value, hint }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="text-xs uppercase tracking-[0.12em] text-slate-400">{label}</div>
      <div className="text-2xl font-black text-slate-900 mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}

function DataTable({ columns, rows, emptyText = "No rows available" }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
          <tr>{columns.map((column) => <th key={column.key} className="px-4 py-3 text-left font-bold">{column.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">{emptyText}</td></tr>
          ) : rows.map((row, index) => (
            <tr key={row.id || row.orderNo || row.stopId || `${row.routeNo}-${row.tripNo}-${index}`} className="hover:bg-slate-50/70">
              {columns.map((column) => <td key={column.key} className="px-4 py-3 text-slate-700">{column.render ? column.render(row, index) : row[column.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RoutesModule({ routes, selected, onSelect, onLock, onRelease, role }) {
  const locked = routes.filter((route) => route.status === "Locked").length;
  const critical = routes.filter((route) => route.status === "Critical" || route.warnings?.length).length;
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <MiniMetric label="Routes" value={routes.length} hint="Visible by selected depot" />
        <MiniMetric label="Critical / warning" value={critical} hint="Need planner attention" />
        <MiniMetric label="Locked" value={locked} hint="Ready for dispatch" />
        <MiniMetric label="Role" value={role} hint="Admin/Planner can control route state" />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <RouteTable visibleRoutes={routes} selected={selected} setSelected={onSelect} role={role} />
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-5">
          <RouteDetails route={selected} role={role} onLock={onLock} onRelease={onRelease} />
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">Batch P45 status</h3>
            <p className="text-sm text-slate-500 mt-2">This Routes module now exposes the route board outside Planning. Database persistence and full route master administration are still pending.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersModule({ assignedOrders, assignableOrders, summary, canEdit, onAssign, onUnassign, selected }) {
  const allOrders = [
    ...assignedOrders.map((order) => ({ ...order, planningStatus: "Assigned" })),
    ...assignableOrders.map((order) => ({ ...order, planningStatus: "Unplanned" })),
  ];
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <MiniMetric label="Assigned" value={summary.assignedCount} hint="Orders on selected route" />
        <MiniMetric label="Unplanned" value={summary.assignableCount} hint="Available to assign" />
        <MiniMetric label="Assigned cases" value={summary.assignedCases} hint="Current route workload" />
        <MiniMetric label="Selected route" value={selected ? `${selected.routeNo}-${selected.tripNo}` : "-"} hint="Order control scope" />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-7">
          <DataTable
            columns={[
              { key: "orderNo", label: "Order" },
              { key: "customer", label: "Customer" },
              { key: "geoZone", label: "Zone" },
              { key: "cases", label: "Cases" },
              { key: "planningStatus", label: "Status", render: (row) => <span className={`px-2 py-1 rounded-full text-xs border ${row.planningStatus === "Assigned" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{row.planningStatus}</span> },
            ]}
            rows={allOrders}
          />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <AssignOrdersPanel route={selected} assignedOrders={assignedOrders} assignableOrders={assignableOrders} summary={summary} canEdit={canEdit} onAssign={onAssign} onUnassign={onUnassign} />
        </div>
      </div>
    </div>
  );
}

function WarehouseModule({ selected, assignedOrders, pickRows, driverRows, onExportPick, onExportDriver }) {
  const totalCases = pickRows.reduce((sum, row) => sum + Number(row.cases || 0), 0);
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <MiniMetric label="Route" value={selected ? `${selected.routeNo}-${selected.tripNo}` : "-"} hint="Pick list scope" />
        <MiniMetric label="Orders" value={assignedOrders.length} hint="Assigned orders" />
        <MiniMetric label="Pick rows" value={pickRows.length} hint="Item lines for loading" />
        <MiniMetric label="Cases" value={totalCases} hint="Warehouse workload" />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <section className="col-span-12 xl:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-900">Warehouse Pick List</h2>
              <p className="text-sm text-slate-500 mt-1">Route-wise item list for picking, staging, and loading sequence control.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={onExportPick} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold">Export Pick CSV</button>
              <button onClick={onExportDriver} className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold">Export Driver CSV</button>
            </div>
          </div>
          <DataTable
            columns={[
              { key: "serialNo", label: "#" },
              { key: "orderNo", label: "Order" },
              { key: "customer", label: "Customer" },
              { key: "itemCode", label: "Item" },
              { key: "itemName", label: "Description" },
              { key: "cases", label: "Cases" },
            ]}
            rows={pickRows}
          />
        </section>
        <aside className="col-span-12 xl:col-span-4 space-y-5">
          <ExportPanel driverRows={driverRows} pickRows={pickRows} onExportDriver={onExportDriver} onExportPick={onExportPick} />
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5">
            <h3 className="font-bold text-emerald-900">Batch implementation</h3>
            <p className="text-sm text-emerald-700 mt-2">P45 delivered a visible warehouse module using the existing export helpers. Excel/PDF formatting can be added after database persistence.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DriverModule({ selected, driverWorkflowStops, driverWorkflowSummary, sequencedStops, provider }) {
  const [stopStatuses, setStopStatuses] = React.useState({});
  const [actionMessage, setActionMessage] = React.useState("");
  const mobileRoute = selected ? { ...selected, stops: sequencedStops.map((stop, index) => ({ ...stop, sequence: index + 1, status: stopStatuses[stop.stopId] || stop.status || "Planned", plannedArrival: stop.plannedEta })) } : null;

  const handleStopStatus = async (stop, status) => {
    if (!selected) return;
    setStopStatuses((current) => ({ ...current, [stop.stopId]: status }));
    setActionMessage(`${stop.customerName || stop.stopId} marked ${status}`);
    try {
      await routeIqApi("/api/driver/stops/status", {
        method: "POST",
        body: { routeNo: selected.routeNo, tripNo: selected.tripNo, stopId: stop.stopId, status, latitude: stop.lat, longitude: stop.lng },
      });
      setActionMessage(`${stop.customerName || stop.stopId} saved to backend as ${status}`);
    } catch {
      setActionMessage(`${stop.customerName || stop.stopId} updated locally; backend sync pending`);
    }
  };

  const driverRowsWithStatus = driverWorkflowStops.map((stop) => ({ ...stop, status: stopStatuses[stop.stopId] || stop.status || "Planned" }));

  return (
    <div className="grid grid-cols-12 gap-5">
      <section className="col-span-12 xl:col-span-8 space-y-5">
        <div className="grid md:grid-cols-4 gap-4">
          <MiniMetric label="Route" value={selected ? `${selected.routeNo}-${selected.tripNo}` : "-"} hint="Driver execution view" />
          <MiniMetric label="Stops" value={driverWorkflowSummary?.totalStops || 0} hint="Sequenced stops" />
          <MiniMetric label="Pending" value={driverWorkflowSummary?.pendingStops || 0} hint="Awaiting execution" />
          <MiniMetric label="Navigation" value={provider.navigationProvider.replaceAll("-", " ")} hint="External app link" />
        </div>
        <DriverWorkflowPanel stops={driverWorkflowStops} summary={driverWorkflowSummary} />
        {actionMessage && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">{actionMessage}</div>}
        <DataTable
          columns={[
            { key: "sequenceNo", label: "Seq" },
            { key: "customerName", label: "Customer" },
            { key: "plannedEta", label: "ETA" },
            { key: "deliveryCases", label: "Cases" },
            { key: "status", label: "Status" },
            { key: "navigationUrl", label: "Navigation", render: (row) => <a className="text-blue-600 font-semibold" href={row.navigationUrl} target="_blank" rel="noreferrer">Open map</a> },
            { key: "actions", label: "Actions", render: (row) => (
              <div className="flex gap-2">
                <button type="button" onClick={() => handleStopStatus(row, "Started")} className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">Start</button>
                <button type="button" onClick={() => handleStopStatus(row, "Completed")} className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">Complete</button>
              </div>
            ) },
          ]}
          rows={driverRowsWithStatus}
        />
      </section>
      <aside className="col-span-12 xl:col-span-4 flex justify-center xl:justify-end">
        <DriverMobileScreen route={mobileRoute} summary={{ completed: driverWorkflowSummary?.completedStops || 0, totalStops: driverWorkflowSummary?.totalStops || 0 }} />
      </aside>
    </div>
  );
}

function ActualModule({ selected, actualSummary, etaSnapshots }) {
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <MiniMetric label="Route" value={selected ? `${selected.routeNo}-${selected.tripNo}` : "-"} hint="Execution variance scope" />
        <MiniMetric label="Stop variance" value={actualSummary?.stopVariance ?? "-"} hint="Actual minus planned" />
        <MiniMetric label="Case variance" value={actualSummary?.caseVariance ?? "-"} hint="Delivered workload gap" />
        <MiniMetric label="Service variance" value={actualSummary ? `${actualSummary.serviceMinuteVariance}m` : "-"} hint="Service-time gap" />
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-4"><ActualVsPlannedPanel summary={actualSummary} /></div>
        <div className="col-span-12 xl:col-span-8">
          <DataTable
            columns={[
              { key: "stopId", label: "Stop" },
              { key: "plannedEta", label: "Planned ETA" },
              { key: "latestEta", label: "Latest ETA" },
              { key: "etaVarianceMinutes", label: "Variance" },
              { key: "confidence", label: "Confidence" },
              { key: "source", label: "Source" },
            ]}
            rows={etaSnapshots}
          />
        </div>
      </div>
    </div>
  );
}

function TrackingModule({ selected, trackingPoint, etaSnapshots, etaHealth }) {
  return (
    <div className="grid grid-cols-12 gap-5">
      <section className="col-span-12 xl:col-span-7 space-y-5">
        <MapMock selected={selected} />
        <LiveEtaPanel trackingPoint={trackingPoint} etaSnapshots={etaSnapshots} etaHealth={etaHealth} />
      </section>
      <aside className="col-span-12 xl:col-span-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <MiniMetric label="Signal" value={trackingPoint?.signalStatus || "Offline"} hint="Mock tracking state" />
          <MiniMetric label="ETA health" value={etaHealth} hint="Based on ETA variance" />
          <MiniMetric label="Latitude" value={trackingPoint?.lat?.toFixed(3) || "-"} hint="First stop mock ping" />
          <MiniMetric label="Longitude" value={trackingPoint?.lng?.toFixed(3) || "-"} hint="First stop mock ping" />
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-5">
          <h3 className="font-bold text-amber-900">Tracking status</h3>
          <p className="text-sm text-amber-700 mt-2">This is still simulated telemetry. Real GPS requires driver phone permission, backend storage, and live refresh.</p>
        </div>
      </aside>
    </div>
  );
}

function ReportsModule({ visibleRoutes, assignableOrders, actualSummary }) {
  const totalCasesPct = visibleRoutes.reduce((sum, route) => sum + route.casesPct, 0);
  const avgLoad = visibleRoutes.length ? Math.round(totalCasesPct / visibleRoutes.length) : 0;
  const avgCpc = visibleRoutes.length ? (visibleRoutes.reduce((sum, route) => sum + route.costPerCase, 0) / visibleRoutes.length).toFixed(3) : "0.000";
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-4 gap-4">
        <MiniMetric label="Avg load" value={`${avgLoad}%`} hint="Visible fleet utilization" />
        <MiniMetric label="Avg CPC" value={avgCpc} hint="Cost per case sample" />
        <MiniMetric label="Unplanned orders" value={assignableOrders.length} hint="Planning backlog" />
        <MiniMetric label="Variance tone" value={actualSummary?.tone || "No data"} hint="Selected route" />
      </div>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-900">Management KPI Dashboard</h2>
        <p className="text-sm text-slate-500 mt-2">Initial KPI shell using current planning data. Full management reporting needs persisted route, order, vehicle, driver, and execution history.</p>
        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {['Planning time reduction', 'Vehicle utilization', 'OTIF / delivery success', 'Route completion', 'Cost per case', 'Actual vs planned variance'].map((kpi) => (
            <div key={kpi} className="rounded-2xl bg-slate-50 border border-slate-100 p-4 font-semibold text-slate-700">{kpi}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsModule({ session, role, onRoleSessionChange, onClearSession }) {
  return (
    <div className="grid grid-cols-12 gap-5">
      <section className="col-span-12 xl:col-span-7 space-y-5">
        <AuthSessionPanel session={session} role={role} onRoleSessionChange={onRoleSessionChange} onClearSession={onClearSession} />
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">System Configuration Shell</h2>
          <div className="mt-5 grid md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><b>Roles</b><p className="text-slate-500 mt-1">Admin, Planner, Viewer demo roles are active.</p></div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><b>Depot filter</b><p className="text-slate-500 mt-1">Depot-level planning filter exists in the header.</p></div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><b>Map provider</b><p className="text-slate-500 mt-1">Google backend proxy is planned, not exposed to browser.</p></div>
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><b>Production auth</b><p className="text-slate-500 mt-1">Pending Supabase/Clerk/Auth0 decision.</p></div>
          </div>
        </div>
      </section>
      <aside className="col-span-12 xl:col-span-5">
        <ModuleShell moduleId="settings" />
      </aside>
    </div>
  );
}

/**
 * RouteIQ Planner Prototype
 * Modular frontend prototype for developer handoff.
 *
 * Current scope:
 * - Multi-depot planning
 * - Route lock/release
 * - Manual stop sequencing
 * - Unplanned order assignment
 * - Driver stop list and warehouse pick list CSV exports
 * - Planned vs actual monitoring foundation
 * - Local persistence adapter foundation
 * - Routing provider selection foundation
 * - Driver mobile workflow preview
 * - Live ETA / GPS tracking foundation
 *
 * No production backend/API keys/live GPS provider yet.
 */

export default function RouteIQPrototype() {
  const [initialSnapshot] = useState(() => loadPlanningSnapshot());
  const [session, setSession] = useState(() => loadRouteIqSession() || createDemoSession("Admin"));
  const [role, setRole] = useState(() => session?.user?.role || "Admin");
  const [depot, setDepot] = useState("ALL");
  const [routes, setRoutes] = useState(() => initialSnapshot?.routes || ROUTES);
  const [stopSequencePlans, setStopSequencePlans] = useState(() => initialSnapshot?.stopSequencePlans || ROUTE_STOP_SEQUENCE_PLANS);
  const [assignmentPlans, setAssignmentPlans] = useState(() => initialSnapshot?.assignmentPlans || ROUTE_ORDER_ASSIGNMENT_PLANS);
  const [resequencingAuditNotes, setResequencingAuditNotes] = useState(() => initialSnapshot?.resequencingAuditNotes || []);
  const [lastSavedAt, setLastSavedAt] = useState(() => initialSnapshot?.savedAt || null);
  const [activeModule, setActiveModule] = useState("planning");
  const [syncStatus, setSyncStatus] = useState("Not synced");

  React.useEffect(() => {
    const snapshot = createPlanningSnapshot({ routes, stopSequencePlans, assignmentPlans, resequencingAuditNotes });
    if (savePlanningSnapshot(snapshot)) {
      setLastSavedAt(snapshot.savedAt);
    }
  }, [routes, stopSequencePlans, assignmentPlans, resequencingAuditNotes]);

  const visibleRoutes = useMemo(() => selectVisibleRoutes(routes, depot), [routes, depot]);
  const [selectedRouteKey, setSelectedRouteKey] = useState(() => getRouteKey(ROUTES[0]));
  const selected = useMemo(
    () => findRouteByKey(visibleRoutes, selectedRouteKey) || visibleRoutes[0],
    [visibleRoutes, selectedRouteKey]
  );

  React.useEffect(() => {
    if (selected) setSelectedRouteKey(getRouteKey(selected));
  }, [depot, selected]);

  const sequencedStops = useMemo(() => {
    if (!selected) return [];
    return selectSequencedStopsForRoute(stopSequencePlans, selected.routeNo, selected.tripNo);
  }, [selected, stopSequencePlans]);

  const stopSequenceSummary = useMemo(() => selectStopSequenceSummary(sequencedStops), [sequencedStops]);

  const assignedOrders = useMemo(() => {
    if (!selected) return [];
    return selectAssignedOrdersForRoute(assignmentPlans, selected.routeNo, selected.tripNo);
  }, [selected, assignmentPlans]);

  const assignableOrders = useMemo(() => {
    return selectAssignableOrders(UNPLANNED_ORDERS, getAssignedOrderNos(assignmentPlans));
  }, [assignmentPlans]);

  const assignmentSummary = useMemo(() => selectAssignmentSummary(assignedOrders, assignableOrders), [assignedOrders, assignableOrders]);

  const actualSummary = useMemo(() => {
    if (!selected) return null;
    return selectActualVsPlannedSummary(selectActualMetricForRoute(ACTUAL_ROUTE_METRICS, selected.routeNo, selected.tripNo));
  }, [selected]);

  const driverRows = useMemo(() => (selected ? buildDriverStopListRows(selected, sequencedStops) : []), [selected, sequencedStops]);
  const pickRows = useMemo(() => (selected ? buildWarehousePickListRows(selected, assignedOrders, ROUTE_PICK_ITEMS) : []), [selected, assignedOrders]);

  const selectedRoutingProvider = useMemo(() => getSelectedRoutingProvider(), []);

  const routingUsageEstimate = useMemo(() => {
    return estimateRoutingUsage(selected, sequencedStops, ROUTEIQ_ROUTING_COST_POLICY);
  }, [selected, sequencedStops]);

  const routingCacheKey = useMemo(() => {
    if (!selected) return "";
    return getRouteCacheKey(selected, sequencedStops);
  }, [selected, sequencedStops]);

  const driverWorkflowStops = useMemo(() => {
    return buildDriverWorkflowStops(sequencedStops, selectedRoutingProvider.navigationProvider);
  }, [sequencedStops, selectedRoutingProvider]);

  const driverWorkflowSummary = useMemo(() => selectDriverWorkflowSummary(driverWorkflowStops), [driverWorkflowStops]);

  const trackingPoint = useMemo(() => {
    if (!selected || sequencedStops.length === 0) return null;
    const firstStop = sequencedStops[0];
    return buildMockTrackingPoint({
      routeNo: selected.routeNo,
      tripNo: selected.tripNo,
      vehicle: selected.vehicle,
      lat: firstStop.lat,
      lng: firstStop.lng,
    });
  }, [selected, sequencedStops]);

  const etaSnapshots = useMemo(() => buildMockEtaSnapshots(sequencedStops), [sequencedStops]);
  const etaHealth = useMemo(() => selectEtaHealth(etaSnapshots), [etaSnapshots]);

  const canEditRouteWorkflows = canManageRoutes(role);

  const handleRoleSessionChange = async (nextRole) => {
    try {
      const nextSession = await demoLogin(nextRole);
      saveRouteIqSession(nextSession);
      setSession(nextSession);
      setRole(nextRole);
    } catch {
      const nextSession = createDemoSession(nextRole);
      saveRouteIqSession(nextSession);
      setSession(nextSession);
      setRole(nextRole);
    }
  };

  const handleSyncSnapshot = async () => {
    setSyncStatus("Saving...");
    try {
      const snapshot = createPlanningSnapshot({ routes, stopSequencePlans, assignmentPlans, resequencingAuditNotes });
      const saved = await routeIqApi("/api/planning/snapshot", { method: "PUT", body: { snapshot } });
      setSyncStatus(saved?.serverSavedAt ? new Date(saved.serverSavedAt).toLocaleTimeString() : "Saved");
    } catch (error) {
      setSyncStatus("Backend offline");
    }
  };

  const handleClearSession = () => {
    clearRouteIqSession();
    const nextSession = createDemoSession("Viewer");
    setSession(nextSession);
    setRole("Viewer");
  };

  const handleSelectRoute = (route) => setSelectedRouteKey(getRouteKey(route));
  const handleLockRoute = (route) => setRoutes((currentRoutes) => lockRoutePlan(currentRoutes, route));
  const handleReleaseRoute = (route) => setRoutes((currentRoutes) => releaseRoutePlan(currentRoutes, route));

  const handleMoveStop = (stopId, direction) => {
    if (!selected || !canEditRouteWorkflows) return;
    setStopSequencePlans((plans) => updateStopSequencePlan(plans, selected.routeNo, selected.tripNo, stopId, direction));
    setResequencingAuditNotes((notes) => [
      createResequenceAuditNote(selected.routeNo, selected.tripNo, stopId, direction, role),
      ...notes,
    ]);
  };

  const handleAssignOrder = (order) => {
    if (!selected || !canEditRouteWorkflows) return;
    setAssignmentPlans((plans) => assignOrderToRoute(plans, selected.routeNo, selected.tripNo, order));
  };

  const handleUnassignOrder = (orderNo) => {
    if (!selected || !canEditRouteWorkflows) return;
    setAssignmentPlans((plans) => unassignOrderFromRoute(plans, selected.routeNo, selected.tripNo, orderNo));
  };

  const handleExportDriver = () => {
    if (!selected) return;
    downloadCsv(`${selected.routeNo}-trip-${selected.tripNo}-driver-stop-list.csv`, driverRows);
  };

  const handleExportPick = () => {
    if (!selected) return;
    downloadCsv(`${selected.routeNo}-trip-${selected.tripNo}-warehouse-pick-list.csv`, pickRows);
  };

  const renderPlanningModule = () => (
    <>
      <KpiCards visibleRoutes={visibleRoutes} role={role} />
      <PlanningToolbar />
      <div className="text-xs text-slate-400">Persistence: local draft saved {lastSavedAt ? new Date(lastSavedAt).toLocaleString() : "not yet saved"}</div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <RouteTable visibleRoutes={visibleRoutes} selected={selected} setSelected={handleSelectRoute} role={role} />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <UnplannedOrders orders={assignableOrders} />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-7 space-y-5">
          <MapMock selected={selected} />
          <StopSequencePanel
            route={selected}
            stops={sequencedStops}
            summary={stopSequenceSummary}
            canEdit={canEditRouteWorkflows}
            onMoveUp={(stopId) => handleMoveStop(stopId, "up")}
            onMoveDown={(stopId) => handleMoveStop(stopId, "down")}
          />
          <AssignOrdersPanel
            route={selected}
            assignedOrders={assignedOrders}
            assignableOrders={assignableOrders}
            summary={assignmentSummary}
            canEdit={canEditRouteWorkflows}
            onAssign={handleAssignOrder}
            onUnassign={handleUnassignOrder}
          />
          <DriverWorkflowPanel stops={driverWorkflowStops} summary={driverWorkflowSummary} />
        </div>
        <div className="col-span-12 xl:col-span-5 space-y-5">
          <RouteDetails route={selected} role={role} onLock={handleLockRoute} onRelease={handleReleaseRoute} />
          <AuthSessionPanel
            session={session}
            role={role}
            onRoleSessionChange={handleRoleSessionChange}
            onClearSession={handleClearSession}
          />
          <ExportPanel
            driverRows={driverRows}
            pickRows={pickRows}
            onExportDriver={handleExportDriver}
            onExportPick={handleExportPick}
          />
          <ActualVsPlannedPanel summary={actualSummary} />
          <ProviderStatusPanel provider={selectedRoutingProvider} />
          <RoutingCostControlPanel
            policy={ROUTEIQ_ROUTING_COST_POLICY}
            estimate={routingUsageEstimate}
            cacheKey={routingCacheKey}
          />
          <LiveEtaPanel trackingPoint={trackingPoint} etaSnapshots={etaSnapshots} etaHealth={etaHealth} />
          {resequencingAuditNotes.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-3">Resequencing Audit</h2>
              <div className="space-y-2">
                {resequencingAuditNotes.slice(0, 3).map((note) => (
                  <div key={note.id} className="text-xs text-slate-500 border border-slate-100 rounded-xl p-3">
                    {note.note} • {note.createdByRole}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderActiveModule = () => {
    if (activeModule === "planning") return renderPlanningModule();
    if (activeModule === "admin-upload") {
      return (
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 2xl:col-span-9">
            <ImportDataPanel role={role} />
          </div>
          <div className="col-span-12 2xl:col-span-3 space-y-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900">P43 status</h3>
              <p className="text-sm text-slate-500 mt-2">Admin upload validation is built as a validate-only pilot safety workflow. The next step is backend import commit and audit history.</p>
            </div>
            <AuthSessionPanel session={session} role={role} onRoleSessionChange={handleRoleSessionChange} onClearSession={handleClearSession} />
          </div>
        </div>
      );
    }
    if (activeModule === "routes") return <RoutesModule routes={visibleRoutes} selected={selected} onSelect={handleSelectRoute} onLock={handleLockRoute} onRelease={handleReleaseRoute} role={role} />;
    if (activeModule === "orders") return <OrdersModule assignedOrders={assignedOrders} assignableOrders={assignableOrders} summary={assignmentSummary} canEdit={canEditRouteWorkflows} onAssign={handleAssignOrder} onUnassign={handleUnassignOrder} selected={selected} />;
    if (activeModule === "warehouse") return <WarehouseModule selected={selected} assignedOrders={assignedOrders} pickRows={pickRows} driverRows={driverRows} onExportPick={handleExportPick} onExportDriver={handleExportDriver} />;
    if (activeModule === "driver") return <DriverModule selected={selected} driverWorkflowStops={driverWorkflowStops} driverWorkflowSummary={driverWorkflowSummary} sequencedStops={sequencedStops} provider={selectedRoutingProvider} />;
    if (activeModule === "actual") return <ActualModule selected={selected} actualSummary={actualSummary} etaSnapshots={etaSnapshots} />;
    if (activeModule === "tracking") return <TrackingModule selected={selected} trackingPoint={trackingPoint} etaSnapshots={etaSnapshots} etaHealth={etaHealth} />;
    if (activeModule === "reports") return <ReportsModule visibleRoutes={visibleRoutes} assignableOrders={assignableOrders} actualSummary={actualSummary} />;
    if (activeModule === "settings") return <SettingsModule session={session} role={role} onRoleSessionChange={handleRoleSessionChange} onClearSession={handleClearSession} />;
    return <ModuleShell moduleId={activeModule} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <AppNavigation activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 min-w-0">
        <MobileModuleTabs activeModule={activeModule} setActiveModule={setActiveModule} />
        <Header role={role} setRole={handleRoleSessionChange} depot={depot} setDepot={setDepot} />
        <div className="p-6 space-y-5">
          <ProjectStatusBanner activeModule={activeModule} syncStatus={syncStatus} onSyncSnapshot={handleSyncSnapshot} />
          {renderActiveModule()}
        </div>
      </main>
    </div>
  );
}
