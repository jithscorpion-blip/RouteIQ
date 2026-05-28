import React, { useMemo, useState } from "react";
import { parseSimpleCsv } from "../importer/csvParser";
import { validateImportedRows } from "../importer/importValidation";
import { routeIqApi } from "../api/backendClient";

const ENTITY_CONFIG = [
  {
    entityName: "customers",
    label: "Customers",
    fileHint: "customers_sample.csv",
    requiredFields: ["customerCode", "customerName", "latitude", "longitude"],
  },
  {
    entityName: "orders",
    label: "Orders",
    fileHint: "orders_sample.csv",
    requiredFields: ["orderNo", "customerCode", "cases", "weightKg", "cbm"],
  },
  {
    entityName: "routes",
    label: "Routes",
    fileHint: "routes_sample.csv",
    requiredFields: ["routeId", "depot", "vehicleCode", "driverName"],
  },
  {
    entityName: "vehicles",
    label: "Vehicles",
    fileHint: "vehicles_sample.csv",
    requiredFields: ["vehicleCode", "vehicleName", "maxWeightKg", "maxCbm"],
  },
];

const STATUS_STYLE = {
  pending: "bg-slate-50 text-slate-600 border-slate-200",
  pass: "bg-emerald-50 text-emerald-700 border-emerald-100",
  fail: "bg-rose-50 text-rose-700 border-rose-100",
};

function getUploadStatus(result) {
  if (!result) return { key: "pending", label: "Pending" };
  return result.ok ? { key: "pass", label: "Valid" } : { key: "fail", label: "Fix required" };
}

function ValidationIssueList({ title, issues, tone }) {
  if (!issues?.length) return null;
  const toneClass = tone === "error" ? "text-rose-700 bg-rose-50 border-rose-100" : "text-amber-700 bg-amber-50 border-amber-100";
  return (
    <div className={`rounded-xl border p-3 ${toneClass}`}>
      <div className="font-semibold mb-2">{title}</div>
      <div className="space-y-1 max-h-28 overflow-auto pr-1">
        {issues.slice(0, 8).map((issue, index) => (
          <div key={`${issue.rowNumber}-${issue.field}-${index}`}>
            Row {issue.rowNumber || "file"} • {issue.field}: {issue.message}
          </div>
        ))}
        {issues.length > 8 && <div>+{issues.length - 8} more issue(s)</div>}
      </div>
    </div>
  );
}

function PreviewTable({ rows }) {
  const previewRows = rows?.slice(0, 3) ?? [];
  const headers = useMemo(() => Object.keys(previewRows[0] || {}).slice(0, 6), [previewRows]);
  if (previewRows.length === 0 || headers.length === 0) return null;

  return (
    <div className="overflow-x-auto border border-slate-100 rounded-xl">
      <table className="min-w-full text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {previewRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header) => (
                <td key={header} className="px-3 py-2 text-slate-600 whitespace-nowrap">{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UploadCard({ config, result, onFileSelected, disabled }) {
  const status = getUploadStatus(result);
  const requiredLabel = config.requiredFields.join(", ");

  return (
    <div className="rounded-2xl border border-slate-200 p-4 bg-white shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">{config.label}</h3>
          <p className="text-xs text-slate-500 mt-1">Template: {config.fileHint}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLE[status.key]}`}>{status.label}</span>
      </div>

      <label className={`block rounded-xl border border-dashed p-3 text-xs ${disabled ? "bg-slate-50 text-slate-400 border-slate-200" : "cursor-pointer hover:bg-slate-50 text-slate-600 border-slate-300"}`}>
        <input
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          disabled={disabled}
          onChange={(event) => onFileSelected(config.entityName, event.target.files?.[0])}
        />
        Upload CSV, validate, then commit approved rows.
      </label>

      <div className="text-[11px] text-slate-500">Required: {requiredLabel}</div>

      {result && (
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl bg-slate-50 p-2">
            <div className="text-slate-400">Rows</div>
            <div className="font-bold text-slate-900">{result.totalRows}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-2">
            <div className="text-slate-400">Valid</div>
            <div className="font-bold text-slate-900">{result.validRows}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-2">
            <div className="text-slate-400">Issues</div>
            <div className="font-bold text-slate-900">{result.errors.length + result.warnings.length}</div>
          </div>
        </div>
      )}

      <ValidationIssueList title="Errors" issues={result?.errors} tone="error" />
      <ValidationIssueList title="Warnings" issues={result?.warnings} tone="warning" />
      <PreviewTable rows={result?.rows} />
    </div>
  );
}

export function ImportDataPanel({ role = "Viewer" }) {
  const [uploadResults, setUploadResults] = useState({});
  const [lastValidatedAt, setLastValidatedAt] = useState(null);
  const [readError, setReadError] = useState("");
  const [commitStatus, setCommitStatus] = useState(null);
  const [commitBusy, setCommitBusy] = useState(false);
  const [history, setHistory] = useState([]);
  const canUpload = ["Admin", "Planner"].includes(role);

  const totals = useMemo(() => {
    const results = Object.values(uploadResults).filter(Boolean);
    return {
      files: results.length,
      rows: results.reduce((sum, result) => sum + result.totalRows, 0),
      validRows: results.reduce((sum, result) => sum + result.validRows, 0),
      errors: results.reduce((sum, result) => sum + result.errors.length, 0),
      warnings: results.reduce((sum, result) => sum + result.warnings.length, 0),
      allValid: results.length > 0 && results.every((result) => result.ok),
    };
  }, [uploadResults]);

  const handleFileSelected = async (entityName, file) => {
    if (!file) return;
    setReadError("");
    try {
      const content = await file.text();
      const rows = parseSimpleCsv(content);
      const validation = validateImportedRows(entityName, rows);
      setUploadResults((current) => ({
        ...current,
        [entityName]: {
          ...validation,
          fileName: file.name,
          rows,
        },
      }));
      setLastValidatedAt(new Date().toISOString());
    } catch (error) {
      setReadError(error?.message || "Unable to read CSV file.");
    }
  };

  const handleClear = () => {
    setUploadResults({});
    setLastValidatedAt(null);
    setReadError("");
    setCommitStatus(null);
  };

  const buildCommitFiles = () => Object.fromEntries(
    Object.entries(uploadResults).map(([entityName, result]) => [entityName, result?.rows || []])
  );

  const handleCommitImport = async () => {
    if (!canUpload || !totals.allValid) return;
    setCommitBusy(true);
    setCommitStatus(null);
    try {
      const data = await routeIqApi("/api/import/commit", {
        method: "POST",
        body: { source: "p50-pilot-admin-upload", files: buildCommitFiles() },
      });
      setCommitStatus(data);
      const importHistory = await routeIqApi("/api/import/history");
      setHistory(importHistory);
    } catch (error) {
      setCommitStatus({ ok: false, committed: false, message: error?.message || "Import commit failed. Check backend server and login role." });
    } finally {
      setCommitBusy(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
        <div>
          <h2 className="font-bold text-slate-900">Admin Data Upload Validation</h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload pilot CSV files, parse rows in-browser, and validate required/numeric fields before backend import.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full border ${totals.allValid ? STATUS_STYLE.pass : STATUS_STYLE.pending}`}>
            {totals.allValid ? "Pilot data ready" : "Validate only"}
          </span>
          <button
            type="button"
            onClick={handleCommitImport}
            disabled={!canUpload || !totals.allValid || commitBusy}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold ${canUpload && totals.allValid && !commitBusy ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-400 border-slate-200"}`}
          >
            {commitBusy ? "Committing..." : "Commit to staging store"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </div>

      {!canUpload && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl p-3">
          Upload is restricted to Admin or Planner demo sessions. Current role can view validation status only.
        </div>
      )}

      {readError && <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3">{readError}</div>}

      {commitStatus && (
        <div className={`text-xs rounded-xl p-3 border ${commitStatus.committed ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}>
          <b>{commitStatus.committed ? "Committed" : "Not committed"}</b> — {commitStatus.message}
          {commitStatus.batch && <span> Batch: {commitStatus.batch.id} • Rows: {commitStatus.batch.totalRows}</span>}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-center text-xs">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-slate-400">Files</div>
          <div className="font-bold text-slate-900 text-lg">{totals.files}/4</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-slate-400">Rows</div>
          <div className="font-bold text-slate-900 text-lg">{totals.rows}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-slate-400">Valid Rows</div>
          <div className="font-bold text-slate-900 text-lg">{totals.validRows}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="text-slate-400">Errors</div>
          <div className="font-bold text-slate-900 text-lg">{totals.errors}</div>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 col-span-2 lg:col-span-1">
          <div className="text-slate-400">Warnings</div>
          <div className="font-bold text-slate-900 text-lg">{totals.warnings}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
        {ENTITY_CONFIG.map((config) => (
          <UploadCard
            key={config.entityName}
            config={config}
            result={uploadResults[config.entityName]}
            disabled={!canUpload}
            onFileSelected={handleFileSelected}
          />
        ))}
      </div>

      {history.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
          <div className="font-bold text-slate-900 mb-2">Recent import history</div>
          {history.slice(0, 3).map((batch) => (
            <div key={batch.id} className="flex justify-between gap-3 border-t border-slate-200 py-2 first:border-t-0">
              <span>{batch.id} • {batch.committedBy}</span>
              <span>{new Date(batch.committedAt).toLocaleString()} • {batch.totalRows} rows</span>
            </div>
          ))}
        </div>
      )}

      <div className="text-[11px] text-slate-400">
        Last validation: {lastValidatedAt ? new Date(lastValidatedAt).toLocaleString() : "not run"} • P50/P51 adds backend commit into local/staging store.
      </div>
    </div>
  );
}
