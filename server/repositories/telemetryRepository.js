import { getMemoryStore, query, shouldUsePostgres } from "../db/databaseClient.js";

function mapTelemetryRow(row) {
  return {
    id: row.telemetry_id,
    driverId: row.driver_id,
    vehicleId: row.vehicle_id,
    routeId: row.route_id,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    speedKph: row.speed_kph === null ? null : Number(row.speed_kph),
    heading: row.heading === null ? null : Number(row.heading),
    capturedAt: row.captured_at,
    receivedAt: row.received_at,
  };
}

export async function insertTelemetryPingRepository(payload) {
  if (!shouldUsePostgres()) {
    getMemoryStore().telemetry.push(payload);
    return payload;
  }

  const result = await query(
    `insert into planning_vehicle_telemetry (
        telemetry_id, driver_id, vehicle_id, route_id, latitude, longitude,
        speed_kph, heading, captured_at, received_at
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9, now())
      returning telemetry_id, driver_id, vehicle_id, route_id, latitude, longitude,
                speed_kph, heading, captured_at, received_at`,
    [
      payload.id,
      payload.driverId,
      payload.vehicleId || null,
      payload.routeId || null,
      payload.latitude,
      payload.longitude,
      payload.speedKph ?? null,
      payload.heading ?? null,
      payload.capturedAt || new Date().toISOString(),
    ]
  );
  return mapTelemetryRow(result.rows[0]);
}

export async function listTelemetryRepository(routeId) {
  if (!shouldUsePostgres()) {
    return getMemoryStore().telemetry.filter((ping) => !routeId || ping.routeId === routeId);
  }

  const params = [];
  const where = routeId ? "where route_id = $1" : "";
  if (routeId) params.push(routeId);

  const result = await query(
    `select telemetry_id, driver_id, vehicle_id, route_id, latitude, longitude,
            speed_kph, heading, captured_at, received_at
       from planning_vehicle_telemetry
       ${where}
      order by captured_at desc
      limit 500`,
    params
  );
  return result.rows.map(mapTelemetryRow);
}
