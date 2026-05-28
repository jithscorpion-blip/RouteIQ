import React from "react";
import { ROUTEIQ_DEMO_USERS } from "../auth";

/**
 * AuthSessionPanel documents the placeholder login/session state for MVP handoff.
 * Real authentication should replace this with SSO/auth-provider login later.
 */
export function AuthSessionPanel({ session, role, onRoleSessionChange, onClearSession }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="font-bold text-slate-900">Auth Session</h2>
          <p className="text-xs text-slate-500">Demo placeholder. Production auth is server-side only.</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Placeholder
        </span>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-semibold text-slate-500">Active session role</label>
        <select
          value={role}
          onChange={(event) => onRoleSessionChange(event.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white"
        >
          {ROUTEIQ_DEMO_USERS.map((user) => (
            <option key={user.role} value={user.role}>
              {user.role} — {user.name}
            </option>
          ))}
        </select>

        <div className="text-xs text-slate-500 border border-slate-100 rounded-xl p-3 bg-slate-50">
          <div>User: <span className="font-semibold text-slate-700">{session?.user?.name || "Not signed in"}</span></div>
          <div>Mode: <span className="font-semibold text-slate-700">{session?.mode || "none"}</span></div>
          <div>Created: <span className="font-semibold text-slate-700">{session?.createdAt ? new Date(session.createdAt).toLocaleString() : "—"}</span></div>
        </div>

        <button
          type="button"
          onClick={onClearSession}
          className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 hover:bg-slate-50"
        >
          Clear Demo Session
        </button>
      </div>
    </div>
  );
}
