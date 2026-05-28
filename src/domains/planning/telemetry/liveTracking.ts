import type { LiveEtaSnapshot, LiveTrackingPoint, RouteStop } from "../types";

function parseClockMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatClockMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function buildMockTrackingPoint(params: { routeNo: string; tripNo: number; vehicle: string; lat: number; lng: number }): LiveTrackingPoint {
  return {
    routeNo: params.routeNo,
    tripNo: params.tripNo,
    vehicle: params.vehicle,
    lat: params.lat,
    lng: params.lng,
    capturedAt: new Date().toISOString(),
    signalStatus: "Online",
  };
}

export function buildMockEtaSnapshots(stops: RouteStop[], varianceSeedMinutes = 7): LiveEtaSnapshot[] {
  return stops.map((stop, index) => {
    const variance = index % 2 === 0 ? varianceSeedMinutes : -Math.min(varianceSeedMinutes, 4);
    const plannedMinutes = parseClockMinutes(stop.plannedEta);
    return {
      routeNo: stop.routeNo,
      tripNo: stop.tripNo,
      stopId: stop.stopId,
      plannedEta: stop.plannedEta,
      latestEta: formatClockMinutes(plannedMinutes + variance),
      etaVarianceMinutes: variance,
      confidence: Math.abs(variance) <= 5 ? "High" : Math.abs(variance) <= 12 ? "Medium" : "Low",
      source: "Mock",
    };
  });
}

export function selectEtaHealth(snapshots: LiveEtaSnapshot[]): "On Time" | "Watch" | "Delayed" {
  const maxDelay = Math.max(0, ...snapshots.map((snapshot) => snapshot.etaVarianceMinutes));
  if (maxDelay > 15) return "Delayed";
  if (maxDelay > 5) return "Watch";
  return "On Time";
}
