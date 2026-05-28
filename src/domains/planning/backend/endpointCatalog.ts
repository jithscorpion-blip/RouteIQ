export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type BackendEndpointCategory =
  | "planning-routes"
  | "stop-sequencing"
  | "order-assignment"
  | "master-data"
  | "routing-provider"
  | "driver-mobile"
  | "telemetry"
  | "import-export"
  | "audit";

export type BackendEndpointDefinition = {
  method: HttpMethod;
  path: string;
  category: BackendEndpointCategory;
  purpose: string;
  mvpPriority: number;
  requestDto?: string;
  responseDto?: string;
};

export const PLANNING_BACKEND_BASE_PATH = "/api/planning";

export const ROUTEIQ_BACKEND_ENDPOINTS: BackendEndpointDefinition[] = [
  {
    method: "GET",
    path: "/api/planning/routes",
    category: "planning-routes",
    purpose: "List route plans for planner dashboard.",
    mvpPriority: 1,
    requestDto: "GetRoutesRequestDto",
    responseDto: "GetRoutesResponseDto",
  },
  {
    method: "GET",
    path: "/api/planning/routes/:routeId",
    category: "planning-routes",
    purpose: "Read route header, capacity, cost, and status details.",
    mvpPriority: 2,
    responseDto: "GetRouteDetailResponseDto",
  },
  {
    method: "POST",
    path: "/api/planning/routes/:routeId/lock",
    category: "planning-routes",
    purpose: "Lock a validated route for dispatch execution.",
    mvpPriority: 3,
    requestDto: "LockRouteRequestDto",
    responseDto: "LockRouteResponseDto",
  },
  {
    method: "POST",
    path: "/api/planning/routes/:routeId/release",
    category: "planning-routes",
    purpose: "Release a locked route back to editable planning state.",
    mvpPriority: 4,
    requestDto: "ReleaseRouteRequestDto",
    responseDto: "ReleaseRouteResponseDto",
  },
  {
    method: "GET",
    path: "/api/planning/orders/unplanned",
    category: "order-assignment",
    purpose: "List orders not yet assigned to a planned route.",
    mvpPriority: 5,
    requestDto: "GetUnplannedOrdersRequestDto",
    responseDto: "GetUnplannedOrdersResponseDto",
  },
  {
    method: "POST",
    path: "/api/planning/orders/:orderId/assign",
    category: "order-assignment",
    purpose: "Assign an unplanned order to a route or route stop.",
    mvpPriority: 6,
    requestDto: "AssignOrderRequestDto",
    responseDto: "AssignOrderResponseDto",
  },
  {
    method: "POST",
    path: "/api/planning/orders/:orderId/unassign",
    category: "order-assignment",
    purpose: "Remove an order from route assignment.",
    mvpPriority: 7,
    requestDto: "UnassignOrderRequestDto",
    responseDto: "UnassignOrderResponseDto",
  },
  {
    method: "PATCH",
    path: "/api/planning/routes/:routeId/stops/sequence",
    category: "stop-sequencing",
    purpose: "Persist manual stop sequence changes.",
    mvpPriority: 8,
    requestDto: "UpdateStopSequenceRequestDto",
    responseDto: "UpdateStopSequenceApiResponseDto",
  },
  {
    method: "POST",
    path: "/api/routes/recalculate",
    category: "routing-provider",
    purpose: "Server-side route recalculation proxy for paid routing providers.",
    mvpPriority: 9,
    requestDto: "RouteRecalculateRequest",
    responseDto: "RouteRecalculateResult",
  },
  {
    method: "GET",
    path: "/api/planning/routes/:routeId/export/driver-stop-list",
    category: "import-export",
    purpose: "Download driver stop list output.",
    mvpPriority: 10,
    responseDto: "DriverStopListExportApiResponseDto",
  },
  {
    method: "GET",
    path: "/api/planning/routes/:routeId/export/warehouse-pick-list",
    category: "import-export",
    purpose: "Download warehouse pick list output.",
    mvpPriority: 11,
    responseDto: "WarehousePickListExportApiResponseDto",
  },
  {
    method: "GET",
    path: "/api/driver/routes/today",
    category: "driver-mobile",
    purpose: "List today's assigned route for driver mobile workflow.",
    mvpPriority: 12,
    requestDto: "GetTodayDriverRoutesRequestDto",
    responseDto: "GetTodayDriverRoutesResponseDto",
  },
  {
    method: "POST",
    path: "/api/telemetry/location",
    category: "telemetry",
    purpose: "Receive driver or vehicle GPS location ping.",
    mvpPriority: 13,
    requestDto: "LocationPingRequestDto",
    responseDto: "LocationPingResponseDto",
  },
];

export function getEndpointsByCategory(
  category: BackendEndpointCategory,
): BackendEndpointDefinition[] {
  return ROUTEIQ_BACKEND_ENDPOINTS.filter((endpoint) => endpoint.category === category);
}

export function getMvpEndpointPlan(): BackendEndpointDefinition[] {
  return [...ROUTEIQ_BACKEND_ENDPOINTS].sort((a, b) => a.mvpPriority - b.mvpPriority);
}
