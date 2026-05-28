/**
 * RouteIQ planning database draft exports.
 *
 * These are documentation-level references only.
 * Do not import SQL directly into the frontend runtime.
 */
export const ROUTEIQ_PLANNING_SCHEMA_VERSION = "p8-draft-001";

export const ROUTEIQ_PLANNING_SCHEMA_SCOPE = [
  "routes",
  "stops",
  "orders",
  "vehicles",
  "telemetry",
  "eta_snapshots",
  "audit_events",
] as const;
