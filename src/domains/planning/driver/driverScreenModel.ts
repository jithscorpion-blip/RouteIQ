export type DriverScreenStop = {
  stopId: string;
  sequence: number;
  customerName: string;
  address?: string;
  status: "pending" | "arrived" | "completed" | "exception";
  plannedArrival?: string;
  navigationUrl?: string;
};

export type DriverScreenRoute = {
  routeNo: string;
  tripNo: number;
  vehicle: string;
  driverName?: string;
  stops: DriverScreenStop[];
};

export const selectDriverScreenSummary = (route?: DriverScreenRoute | null) => {
  const stops = route?.stops ?? [];
  const completed = stops.filter((stop) => stop.status === "completed").length;
  const exceptions = stops.filter((stop) => stop.status === "exception").length;
  const pending = stops.length - completed - exceptions;
  return { totalStops: stops.length, completed, exceptions, pending };
};
