import { ROUTEIQ_SESSION_STORAGE_KEY } from "../auth/session";

export const ROUTEIQ_API_BASE = import.meta.env?.VITE_ROUTEIQ_API_BASE || "http://localhost:8787";

export function getStoredAuthToken() {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(ROUTEIQ_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw)?.token || "" : "";
  } catch {
    return "";
  }
}

export async function routeIqApi(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${ROUTEIQ_API_BASE}${path}`, {
    method,
    headers: {
      "content-type": "application/json",
      ...(token || getStoredAuthToken() ? { authorization: `Bearer ${token || getStoredAuthToken()}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.ok === false) {
    const message = payload?.error?.message || payload?.message || `RouteIQ API failed: ${response.status}`;
    throw new Error(message);
  }
  return payload.data;
}

export async function demoLogin(role) {
  return routeIqApi("/api/auth/demo-login", { method: "POST", body: { role }, token: "" });
}
