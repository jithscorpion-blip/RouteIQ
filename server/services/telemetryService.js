import { insertTelemetryPingRepository, listTelemetryRepository } from "../repositories/telemetryRepository.js";

export async function ingestLocationPing(payload, user) {
  const ping = {
    id: `gps-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    driverId: payload.driverId || user.id,
    vehicleId: payload.vehicleId,
    routeId: payload.routeId,
    latitude: payload.latitude,
    longitude: payload.longitude,
    speedKph: payload.speedKph ?? null,
    heading: payload.heading ?? null,
    capturedAt: payload.capturedAt || new Date().toISOString(),
    receivedAt: new Date().toISOString(),
  };
  return insertTelemetryPingRepository(ping);
}

export async function listTelemetry(routeId) {
  return listTelemetryRepository(routeId);
}
