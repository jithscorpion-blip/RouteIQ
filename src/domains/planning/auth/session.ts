export const ROUTEIQ_SESSION_STORAGE_KEY = "routeiq.session.v1";

export const ROUTEIQ_DEMO_USERS = [
  { id: "admin-demo", name: "Admin Demo", role: "Admin" },
  { id: "planner-demo", name: "Planner Demo", role: "Planner" },
  { id: "dispatcher-demo", name: "Dispatcher Demo", role: "Dispatcher" },
  { id: "driver-demo", name: "Driver Demo", role: "Driver" },
  { id: "viewer-demo", name: "Viewer Demo", role: "Viewer" },
];

export function createDemoSession(role = "Admin") {
  const user = ROUTEIQ_DEMO_USERS.find((item) => item.role === role) || ROUTEIQ_DEMO_USERS[0];
  return {
    user,
    token: role === "Admin" ? "dev-admin-token" : `demo-${role.toLowerCase()}-token`,
    mode: "demo-placeholder",
    createdAt: new Date().toISOString(),
  };
}

export function loadRouteIqSession() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ROUTEIQ_SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveRouteIqSession(session) {
  if (typeof window === "undefined") return false;
  window.localStorage.setItem(ROUTEIQ_SESSION_STORAGE_KEY, JSON.stringify(session));
  return true;
}

export function clearRouteIqSession() {
  if (typeof window === "undefined") return false;
  window.localStorage.removeItem(ROUTEIQ_SESSION_STORAGE_KEY);
  return true;
}
