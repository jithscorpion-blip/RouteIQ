export const ROUTEIQ_ROLES = ["Admin", "Planner", "Dispatcher", "Driver", "Viewer"];

export const ROLE_PERMISSIONS = {
  Admin: ["route:read", "route:write", "route:lock", "order:assign", "telemetry:read", "telemetry:write", "stop:update", "admin:manage"],
  Planner: ["route:read", "route:write", "route:lock", "order:assign", "telemetry:read", "stop:update"],
  Dispatcher: ["route:read", "order:assign", "telemetry:read"],
  Driver: ["driver:read", "stop:update", "telemetry:write"],
  Viewer: ["route:read", "telemetry:read"],
};

export function hasPermission(user, permission) {
  if (!user?.role) return false;
  return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
}
