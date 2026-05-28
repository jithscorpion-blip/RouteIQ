-- RouteIQ MVP initial planning schema migration.
-- Review before executing in production. This draft mirrors routeiq-planning-schema.sql.

BEGIN;

CREATE TABLE IF NOT EXISTS planning_depots (
  depot_id TEXT PRIMARY KEY,
  depot_code TEXT NOT NULL UNIQUE,
  depot_name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Muscat',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planning_customers (
  customer_id TEXT PRIMARY KEY,
  customer_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  geo_zone_code TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  service_time_minutes INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planning_vehicles (
  vehicle_id TEXT PRIMARY KEY,
  vehicle_code TEXT NOT NULL UNIQUE,
  plate_no TEXT,
  depot_code TEXT,
  capacity_cases NUMERIC(12, 2),
  capacity_weight_kg NUMERIC(12, 2),
  capacity_cbm NUMERIC(12, 2),
  efficiency_factor NUMERIC(8, 2),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planning_orders (
  order_id TEXT PRIMARY KEY,
  order_no TEXT NOT NULL UNIQUE,
  customer_code TEXT NOT NULL,
  depot_code TEXT NOT NULL,
  order_date DATE NOT NULL,
  requested_delivery_date DATE,
  cases NUMERIC(12, 2) NOT NULL DEFAULT 0,
  weight_kg NUMERIC(12, 2) NOT NULL DEFAULT 0,
  cbm NUMERIC(12, 2) NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'unplanned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planning_routes (
  route_id TEXT PRIMARY KEY,
  route_no TEXT NOT NULL,
  trip_no INTEGER NOT NULL DEFAULT 1,
  depot_code TEXT NOT NULL,
  vehicle_code TEXT,
  driver_code TEXT,
  planned_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  planned_cases NUMERIC(12, 2) DEFAULT 0,
  planned_weight_kg NUMERIC(12, 2) DEFAULT 0,
  planned_cbm NUMERIC(12, 2) DEFAULT 0,
  planned_cost NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(route_no, trip_no, planned_date)
);

CREATE TABLE IF NOT EXISTS planning_route_stops (
  stop_id TEXT PRIMARY KEY,
  route_id TEXT NOT NULL REFERENCES planning_routes(route_id) ON DELETE CASCADE,
  stop_sequence INTEGER NOT NULL,
  manual_sequence INTEGER,
  customer_code TEXT NOT NULL,
  planned_arrival TIMESTAMPTZ,
  actual_arrival TIMESTAMPTZ,
  planned_departure TIMESTAMPTZ,
  actual_departure TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'planned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(route_id, stop_sequence)
);

CREATE TABLE IF NOT EXISTS planning_stop_orders (
  stop_order_id TEXT PRIMARY KEY,
  stop_id TEXT NOT NULL REFERENCES planning_route_stops(stop_id) ON DELETE CASCADE,
  order_id TEXT NOT NULL REFERENCES planning_orders(order_id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(stop_id, order_id)
);

CREATE TABLE IF NOT EXISTS planning_vehicle_telemetry (
  telemetry_id TEXT PRIMARY KEY,
  vehicle_code TEXT NOT NULL,
  route_id TEXT REFERENCES planning_routes(route_id) ON DELETE SET NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  speed_kph NUMERIC(8, 2),
  heading_degrees NUMERIC(8, 2),
  captured_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planning_audit_events (
  audit_event_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_role TEXT,
  note TEXT,
  payload_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
