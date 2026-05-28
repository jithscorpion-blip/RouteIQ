import { getMemoryStore, query, shouldUsePostgres, transaction } from "../db/databaseClient.js";

function mapRouteRow(row) {
  return {
    id: row.route_id,
    routeNo: row.route_no,
    depotCode: row.depot_code,
    vehicleId: row.vehicle_id,
    driverId: row.driver_id,
    status: row.status,
    plannedDate: row.planned_date,
    plannedKm: Number(row.planned_km ?? 0),
    plannedMinutes: Number(row.planned_minutes ?? 0),
    totalCases: Number(row.total_cases ?? 0),
    totalWeightKg: Number(row.total_weight_kg ?? 0),
    totalCbm: Number(row.total_cbm ?? 0),
    totalEf: Number(row.total_ef ?? 0),
    estimatedCost: Number(row.estimated_cost ?? 0),
    updatedAt: row.updated_at,
  };
}

export async function listRoutesRepository() {
  if (!shouldUsePostgres()) {
    return getMemoryStore().routes;
  }

  const result = await query(
    `select route_id, route_no, depot_code, vehicle_id, driver_id, status, planned_date,
            planned_km, planned_minutes, total_cases, total_weight_kg, total_cbm,
            total_ef, estimated_cost, updated_at
       from planning_routes
      order by planned_date desc, route_no asc`
  );
  return result.rows.map(mapRouteRow);
}

export async function getRouteByIdRepository(routeId) {
  if (!shouldUsePostgres()) {
    return getMemoryStore().routes.find((item) => item.id === routeId) || null;
  }

  const result = await query(
    `select route_id, route_no, depot_code, vehicle_id, driver_id, status, planned_date,
            planned_km, planned_minutes, total_cases, total_weight_kg, total_cbm,
            total_ef, estimated_cost, updated_at
       from planning_routes
      where route_id = $1`,
    [routeId]
  );
  return result.rows[0] ? mapRouteRow(result.rows[0]) : null;
}

export async function upsertRouteRepository(route) {
  if (!shouldUsePostgres()) {
    const store = getMemoryStore();
    const index = store.routes.findIndex((item) => item.id === route.id);
    if (index >= 0) store.routes[index] = { ...store.routes[index], ...route };
    else store.routes.push(route);
    return index >= 0 ? store.routes[index] : route;
  }

  const result = await query(
    `insert into planning_routes (
        route_id, route_no, depot_code, vehicle_id, driver_id, status, planned_date,
        planned_km, planned_minutes, total_cases, total_weight_kg, total_cbm, total_ef, estimated_cost, updated_at
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14, now())
      on conflict (route_id) do update set
        route_no = excluded.route_no,
        depot_code = excluded.depot_code,
        vehicle_id = excluded.vehicle_id,
        driver_id = excluded.driver_id,
        status = excluded.status,
        planned_date = excluded.planned_date,
        planned_km = excluded.planned_km,
        planned_minutes = excluded.planned_minutes,
        total_cases = excluded.total_cases,
        total_weight_kg = excluded.total_weight_kg,
        total_cbm = excluded.total_cbm,
        total_ef = excluded.total_ef,
        estimated_cost = excluded.estimated_cost,
        updated_at = now()
      returning route_id, route_no, depot_code, vehicle_id, driver_id, status, planned_date,
                planned_km, planned_minutes, total_cases, total_weight_kg, total_cbm,
                total_ef, estimated_cost, updated_at`,
    [
      route.id,
      route.routeNo || route.id,
      route.depotCode || route.depot || null,
      route.vehicleId || null,
      route.driverId || null,
      route.status || "Draft",
      route.plannedDate || new Date().toISOString().slice(0, 10),
      route.plannedKm || route.km || 0,
      route.plannedMinutes || route.minutes || 0,
      route.totalCases || route.cases || 0,
      route.totalWeightKg || route.weightKg || 0,
      route.totalCbm || route.cbm || 0,
      route.totalEf || route.ef || 0,
      route.estimatedCost || route.cost || 0,
    ]
  );
  return mapRouteRow(result.rows[0]);
}

export async function updateRouteStatusRepository(routeId, status) {
  if (!shouldUsePostgres()) {
    const route = getMemoryStore().routes.find((item) => item.id === routeId);
    if (!route) return null;
    route.status = status;
    route.updatedAt = new Date().toISOString();
    return route;
  }

  const result = await query(
    `update planning_routes
        set status = $2, updated_at = now()
      where route_id = $1
      returning route_id, route_no, depot_code, vehicle_id, driver_id, status, planned_date,
                planned_km, planned_minutes, total_cases, total_weight_kg, total_cbm,
                total_ef, estimated_cost, updated_at`,
    [routeId, status]
  );
  return result.rows[0] ? mapRouteRow(result.rows[0]) : null;
}

export async function saveRouteRecalculationRepository(routeId, recalculationResult) {
  if (!shouldUsePostgres()) {
    const store = getMemoryStore();
    store.routeRecalculations = store.routeRecalculations || [];
    const saved = { id: `calc-${Date.now()}`, routeId, result: recalculationResult, createdAt: new Date().toISOString() };
    store.routeRecalculations.push(saved);
    return saved;
  }

  return transaction(async (client) => {
    const result = await client.query(
      `insert into planning_eta_snapshots (route_id, provider, eta_payload, created_at)
       values ($1, $2, $3::jsonb, now())
       returning eta_snapshot_id as id, route_id as "routeId", provider, eta_payload as result, created_at as "createdAt"`,
      [routeId, recalculationResult.provider || "mock", JSON.stringify(recalculationResult)]
    );
    return result.rows[0];
  });
}
