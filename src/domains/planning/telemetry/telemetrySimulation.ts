import type { RouteStop } from "../types";

export type SimulatedTelemetryPoint = {
  routeNo: string;
  tripNo: number;
  vehicle: string;
  lat: number;
  lng: number;
  speedKph: number;
  capturedAt: string;
  source: "simulation";
};

export const buildSimulatedTelemetryTrail = ({
  routeNo,
  tripNo,
  vehicle,
  stops,
}: {
  routeNo: string;
  tripNo: number;
  vehicle: string;
  stops: RouteStop[];
}): SimulatedTelemetryPoint[] => {
  return stops.map((stop, index) => ({
    routeNo,
    tripNo,
    vehicle,
    lat: stop.lat,
    lng: stop.lng,
    speedKph: index === stops.length - 1 ? 0 : 42,
    capturedAt: new Date(Date.now() + index * 10 * 60 * 1000).toISOString(),
    source: "simulation",
  }));
};

export const getLatestTelemetryPoint = (points: SimulatedTelemetryPoint[]) => {
  return points.length ? points[points.length - 1] : null;
};
