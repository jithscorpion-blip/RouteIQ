import {
  getRouteByIdRepository,
  listRoutesRepository,
  saveRouteRecalculationRepository,
  updateRouteStatusRepository,
  upsertRouteRepository,
} from "../repositories/routeRepository.js";
import { recordAuditEvent } from "./auditService.js";
import { recalculateRoute } from "./routingProviderService.js";

export async function listRoutes() {
  return listRoutesRepository();
}

export async function upsertRoute(route, user) {
  const before = route.id ? await getRouteByIdRepository(route.id) : null;
  const saved = await upsertRouteRepository(route);
  await recordAuditEvent({ actorId: user.id, action: "route.upsert", entityType: "route", entityId: saved.id || route.id, before, after: saved });
  return saved;
}

export async function lockRoute(routeId, user) {
  const before = await getRouteByIdRepository(routeId);
  if (!before) throw Object.assign(new Error("Route not found"), { statusCode: 404, code: "ROUTE_NOT_FOUND" });

  const route = await updateRouteStatusRepository(routeId, "Locked");
  await recordAuditEvent({ actorId: user.id, action: "route.lock", entityType: "route", entityId: routeId, before, after: route });
  return route;
}

export async function recalculateRoutePlan(payload, user) {
  const result = await recalculateRoute(payload);
  await saveRouteRecalculationRepository(payload.routeId, result);
  await recordAuditEvent({ actorId: user.id, action: "route.recalculate", entityType: "route", entityId: payload.routeId, after: result });
  return result;
}
