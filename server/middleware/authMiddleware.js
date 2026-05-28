import { verifyRouteIqToken } from "../auth/authService.js";
import { hasPermission } from "../auth/roles.js";
import { createApiError } from "../errors/apiErrors.js";

export function getUserFromRequest(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return verifyRouteIqToken(token);
}

export function requirePermission(req, permission) {
  const user = getUserFromRequest(req);
  if (!user) {
    throw createApiError("UNAUTHORIZED");
  }
  if (!hasPermission(user, permission)) {
    throw createApiError("FORBIDDEN", [{ permission }], `Missing permission: ${permission}`);
  }
  return user;
}
