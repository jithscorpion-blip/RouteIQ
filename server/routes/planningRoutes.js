import { readJsonBody, sendJson } from "../utils/http.js";
import { getUserFromRequest, requirePermission } from "../middleware/authMiddleware.js";
import { listRoutes, upsertRoute, lockRoute, recalculateRoutePlan } from "../services/routeService.js";
import { listOrders, assignOrder, unassignOrder } from "../services/orderService.js";
import { ingestLocationPing, listTelemetry } from "../services/telemetryService.js";
import { getDatabaseMode } from "../db/databaseClient.js";
import { assertValidPayload } from "../validation/planningValidators.js";
import { validateImportRows, listImportSchemas } from "../importValidation/index.js";
import { commitPilotImportBundle, listImportHistory, validatePilotImportBundle } from "../importWorkflow/importCommitService.js";
import { getPlanningSnapshot, savePlanningSnapshotServer } from "../services/planningSnapshotService.js";
import { updateStopExecutionStatus, listStopExecutionEvents } from "../services/driverExecutionService.js";
import { API_ERROR_CODES, createApiError } from "../errors/apiErrors.js";
import { getLiveTrackingPlan } from "../telemetry/index.js";
import { createDemoLoginSession } from "../auth/authService.js";
import { DEMO_USERS } from "../auth/demoUsers.js";

export async function handlePlanningRoute(req, res, url) {
  if (req.method === "GET" && url.pathname === "/") {
    return sendJson(res, 200, { ok: true, service: "RouteIQ backend", message: "Use /api/health for health checks." });
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, service: "RouteIQ backend", databaseMode: getDatabaseMode() });
  }


  if (req.method === "GET" && url.pathname === "/api/auth/demo-users") {
    return sendJson(res, 200, { ok: true, data: DEMO_USERS });
  }

  if (req.method === "POST" && url.pathname === "/api/auth/demo-login") {
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: createDemoLoginSession(body?.role || "Viewer") });
  }

  if (req.method === "GET" && url.pathname === "/api/auth/session") {
    const user = getUserFromRequest(req);
    return sendJson(res, 200, { ok: true, data: { authenticated: Boolean(user), user } });
  }

  if (req.method === "GET" && url.pathname === "/api/routes") {
    requirePermission(req, "route:read");
    return sendJson(res, 200, { ok: true, data: await listRoutes() });
  }

  if (req.method === "POST" && url.pathname === "/api/routes") {
    const user = requirePermission(req, "route:write");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: await upsertRoute(assertValidPayload(body, "upsertRoute"), user) });
  }

  if (req.method === "POST" && url.pathname.endsWith("/lock") && url.pathname.startsWith("/api/routes/")) {
    const user = requirePermission(req, "route:lock");
    const routeId = url.pathname.split("/")[3];
    return sendJson(res, 200, { ok: true, data: await lockRoute(routeId, user) });
  }

  if (req.method === "POST" && url.pathname === "/api/routes/recalculate") {
    const user = requirePermission(req, "route:write");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: await recalculateRoutePlan(assertValidPayload(body, "recalculateRoute"), user) });
  }

  if (req.method === "GET" && url.pathname === "/api/orders") {
    requirePermission(req, "route:read");
    return sendJson(res, 200, { ok: true, data: await listOrders() });
  }

  if (req.method === "POST" && url.pathname === "/api/orders/assign") {
    const user = requirePermission(req, "order:assign");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: await assignOrder(assertValidPayload(body, "assignOrder"), user) });
  }


  if (req.method === "POST" && url.pathname === "/api/orders/unassign") {
    const user = requirePermission(req, "order:assign");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: await unassignOrder(assertValidPayload(body, "unassignOrder").orderId, user) });
  }

  if (req.method === "POST" && url.pathname === "/api/telemetry/location") {
    const user = requirePermission(req, "telemetry:write");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: await ingestLocationPing(assertValidPayload(body, "telemetryLocation"), user) });
  }

  if (req.method === "GET" && url.pathname === "/api/telemetry") {
    requirePermission(req, "telemetry:read");
    return sendJson(res, 200, { ok: true, data: await listTelemetry(url.searchParams.get("routeId")) });
  }



  if (req.method === "GET" && url.pathname === "/api/telemetry/live-plan") {
    requirePermission(req, "telemetry:read");
    return sendJson(res, 200, { ok: true, data: getLiveTrackingPlan() });
  }

  if (req.method === "GET" && url.pathname === "/api/import/schemas") {
    requirePermission(req, "route:read");
    return sendJson(res, 200, { ok: true, data: listImportSchemas() });
  }

  if (req.method === "POST" && url.pathname === "/api/import/validate") {
    requirePermission(req, "route:write");
    const body = await readJsonBody(req);
    if (!body?.entityName || !Array.isArray(body?.rows)) {
      throw createApiError("VALIDATION_FAILED", [
        { field: "entityName", message: "entityName is required." },
        { field: "rows", message: "rows must be an array." },
      ]);
    }
    return sendJson(res, 200, { ok: true, data: validateImportRows(body.entityName, body.rows) });
  }



  if (req.method === "POST" && url.pathname === "/api/import/bundle/validate") {
    requirePermission(req, "route:write");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: validatePilotImportBundle(body?.files || {}) });
  }

  if (req.method === "POST" && url.pathname === "/api/import/commit") {
    const user = requirePermission(req, "route:write");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: await commitPilotImportBundle({ files: body?.files || {}, user, source: body?.source || "admin-upload" }) });
  }

  if (req.method === "GET" && url.pathname === "/api/import/history") {
    requirePermission(req, "route:read");
    return sendJson(res, 200, { ok: true, data: await listImportHistory() });
  }

  if (req.method === "GET" && url.pathname === "/api/planning/snapshot") {
    const user = requirePermission(req, "route:read");
    return sendJson(res, 200, { ok: true, data: await getPlanningSnapshot(user) });
  }

  if (req.method === "PUT" && url.pathname === "/api/planning/snapshot") {
    const user = requirePermission(req, "route:write");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: await savePlanningSnapshotServer(body?.snapshot || body, user) });
  }

  if (req.method === "POST" && url.pathname === "/api/driver/stops/status") {
    const user = requirePermission(req, "stop:update");
    const body = await readJsonBody(req);
    return sendJson(res, 200, { ok: true, data: await updateStopExecutionStatus(body, user) });
  }

  if (req.method === "GET" && url.pathname === "/api/driver/stops/events") {
    requirePermission(req, "telemetry:read");
    return sendJson(res, 200, { ok: true, data: await listStopExecutionEvents(url.searchParams.get("routeNo"), url.searchParams.get("tripNo")) });
  }

  if (req.method === "GET" && url.pathname === "/api/errors") {
    requirePermission(req, "route:read");
    return sendJson(res, 200, { ok: true, data: API_ERROR_CODES });
  }


  return false;
}
