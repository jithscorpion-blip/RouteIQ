import { getMemoryStore, persistMemoryStore } from "../db/databaseClient.js";

export async function updateStopExecutionStatus(payload, user) {
  const store = getMemoryStore();
  store.stopExecutionEvents = store.stopExecutionEvents || [];
  const event = {
    id: `stop-event-${Date.now()}`,
    routeNo: payload.routeNo,
    tripNo: payload.tripNo,
    stopId: payload.stopId,
    status: payload.status,
    reason: payload.reason || "",
    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,
    capturedAt: new Date().toISOString(),
    capturedBy: user?.name || user?.id || "unknown",
    role: user?.role || "unknown",
  };
  store.stopExecutionEvents.unshift(event);
  await persistMemoryStore();
  return event;
}

export async function listStopExecutionEvents(routeNo, tripNo) {
  const events = getMemoryStore().stopExecutionEvents || [];
  return events.filter((event) => {
    if (routeNo && String(event.routeNo) !== String(routeNo)) return false;
    if (tripNo && String(event.tripNo) !== String(tripNo)) return false;
    return true;
  });
}
