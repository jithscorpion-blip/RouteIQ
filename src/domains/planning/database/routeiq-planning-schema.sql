-- RouteIQ Planning Database Schema Draft
-- Productization P8
-- Target: PostgreSQL / Supabase-compatible relational model
-- Scope: routes, stops, orders, vehicles, telemetry, audit events
-- Status: draft only; do not run against production without review.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- Shared enums
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE route_status AS ENUM ('draft', 'planned', 'locked', 'released', 'in_progress', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE stop_status AS ENUM ('pending', 'arrived', 'servicing', 'completed', 'skipped', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('unplanned', 'assigned', 'sequenced', 'loaded', 'delivered', 'partially_delivered', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_status AS ENUM ('active', 'inactive', 'maintenance', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE audit_action AS ENUM (
    'route_created',
    'route_recalculated',
    'route_locked',
    'route_released',
    'route_unlocked',
    'stop_sequence_changed',
    'order_assigned',
    'order_unassigned',
    'driver_started_route',
    'driver_completed_stop',
    'actual_eta_updated',
    'data_imported'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- -----------------------------------------------------------------------------
-- Reference tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planning_depots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  depot_code TEXT NOT NULL UNIQUE,
  depot_name TEXT NOT NULL,
  city TEXT,
  country TEXT DEFAULT 'OM',
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS planning_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_customer_id TEXT UNIQUE,
  customer_code TEXT,
  customer_name TEXT NOT NULL,
  customer_type TEXT,
  geo_zone_code TEXT,
  depot_code TEXT,
  address_line TEXT,
  city TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  service_time_minutes INTEGER NOT NULL DEFAULT 10 CHECK (service_time_minutes >= 0),
  delivery_window_start TIME,
  delivery_window_end TIME,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS planning_drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_driver_id TEXT UNIQUE,
  driver_code TEXT,
  driver_name TEXT NOT NULL,
  phone TEXT,
  depot_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- Vehicles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planning_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_vehicle_id TEXT UNIQUE,
  vehicle_code TEXT NOT NULL UNIQUE,
  plate_number TEXT,
  depot_code TEXT,
  vehicle_type TEXT,
  status vehicle_status NOT NULL DEFAULT 'active',
  max_weight_kg NUMERIC(12, 3) NOT NULL DEFAULT 0 CHECK (max_weight_kg >= 0),
  max_cbm NUMERIC(12, 3) NOT NULL DEFAULT 0 CHECK (max_cbm >= 0),
  max_cases INTEGER NOT NULL DEFAULT 0 CHECK (max_cases >= 0),
  max_ef_units NUMERIC(12, 3) NOT NULL DEFAULT 0 CHECK (max_ef_units >= 0),
  fixed_cost NUMERIC(12, 3) DEFAULT 0,
  variable_cost_per_km NUMERIC(12, 3) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_planning_vehicles_depot_status
  ON planning_vehicles (depot_code, status);

-- -----------------------------------------------------------------------------
-- Orders
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planning_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_order_id TEXT UNIQUE,
  order_number TEXT NOT NULL,
  order_date DATE NOT NULL,
  required_delivery_date DATE,
  customer_id UUID REFERENCES planning_customers(id),
  customer_code TEXT,
  customer_name TEXT,
  depot_code TEXT,
  geo_zone_code TEXT,
  status order_status NOT NULL DEFAULT 'unplanned',
  cases INTEGER NOT NULL DEFAULT 0 CHECK (cases >= 0),
  weight_kg NUMERIC(12, 3) NOT NULL DEFAULT 0 CHECK (weight_kg >= 0),
  cbm NUMERIC(12, 3) NOT NULL DEFAULT 0 CHECK (cbm >= 0),
  ef_units NUMERIC(12, 3) NOT NULL DEFAULT 0 CHECK (ef_units >= 0),
  priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  delivery_window_start TIMESTAMPTZ,
  delivery_window_end TIMESTAMPTZ,
  notes TEXT,
  source_system TEXT,
  source_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_planning_orders_status_date
  ON planning_orders (status, required_delivery_date);
CREATE INDEX IF NOT EXISTS idx_planning_orders_depot_zone
  ON planning_orders (depot_code, geo_zone_code);
CREATE INDEX IF NOT EXISTS idx_planning_orders_customer
  ON planning_orders (customer_id);

-- -----------------------------------------------------------------------------
-- Routes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planning_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_code TEXT NOT NULL,
  route_date DATE NOT NULL,
  depot_code TEXT NOT NULL,
  geo_zone_code TEXT,
  status route_status NOT NULL DEFAULT 'draft',
  vehicle_id UUID REFERENCES planning_vehicles(id),
  driver_id UUID REFERENCES planning_drivers(id),
  planned_start_at TIMESTAMPTZ,
  planned_end_at TIMESTAMPTZ,
  actual_start_at TIMESTAMPTZ,
  actual_end_at TIMESTAMPTZ,
  planned_distance_km NUMERIC(12, 3) DEFAULT 0,
  planned_duration_minutes INTEGER DEFAULT 0,
  planned_cost NUMERIC(12, 3) DEFAULT 0,
  total_cases INTEGER NOT NULL DEFAULT 0,
  total_weight_kg NUMERIC(12, 3) NOT NULL DEFAULT 0,
  total_cbm NUMERIC(12, 3) NOT NULL DEFAULT 0,
  total_ef_units NUMERIC(12, 3) NOT NULL DEFAULT 0,
  weight_utilization_pct NUMERIC(6, 2) DEFAULT 0,
  cbm_utilization_pct NUMERIC(6, 2) DEFAULT 0,
  cases_utilization_pct NUMERIC(6, 2) DEFAULT 0,
  ef_utilization_pct NUMERIC(6, 2) DEFAULT 0,
  route_geometry JSONB,
  provider_route_id TEXT,
  provider_name TEXT,
  locked_by TEXT,
  locked_at TIMESTAMPTZ,
  released_by TEXT,
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (route_code, route_date, depot_code)
);

CREATE INDEX IF NOT EXISTS idx_planning_routes_date_depot_status
  ON planning_routes (route_date, depot_code, status);
CREATE INDEX IF NOT EXISTS idx_planning_routes_vehicle_date
  ON planning_routes (vehicle_id, route_date);
CREATE INDEX IF NOT EXISTS idx_planning_routes_driver_date
  ON planning_routes (driver_id, route_date);

-- -----------------------------------------------------------------------------
-- Stops
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planning_route_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES planning_routes(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES planning_customers(id),
  stop_number INTEGER NOT NULL CHECK (stop_number > 0),
  manual_stop_number INTEGER CHECK (manual_stop_number > 0),
  sequence_source TEXT NOT NULL DEFAULT 'system' CHECK (sequence_source IN ('system', 'manual')),
  status stop_status NOT NULL DEFAULT 'pending',
  customer_code TEXT,
  customer_name TEXT NOT NULL,
  address_line TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  planned_arrival_at TIMESTAMPTZ,
  planned_departure_at TIMESTAMPTZ,
  actual_arrival_at TIMESTAMPTZ,
  actual_departure_at TIMESTAMPTZ,
  service_time_minutes INTEGER NOT NULL DEFAULT 10 CHECK (service_time_minutes >= 0),
  planned_travel_minutes_from_previous INTEGER DEFAULT 0,
  actual_travel_minutes_from_previous INTEGER DEFAULT 0,
  planned_distance_km_from_previous NUMERIC(12, 3) DEFAULT 0,
  actual_distance_km_from_previous NUMERIC(12, 3) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (route_id, stop_number)
);

CREATE INDEX IF NOT EXISTS idx_planning_route_stops_route_sequence
  ON planning_route_stops (route_id, stop_number);
CREATE INDEX IF NOT EXISTS idx_planning_route_stops_customer
  ON planning_route_stops (customer_id);

CREATE TABLE IF NOT EXISTS planning_stop_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stop_id UUID NOT NULL REFERENCES planning_route_stops(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES planning_orders(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by TEXT,
  UNIQUE (stop_id, order_id)
);

CREATE INDEX IF NOT EXISTS idx_planning_stop_orders_order
  ON planning_stop_orders (order_id);

-- -----------------------------------------------------------------------------
-- Telemetry / Actual tracking
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planning_vehicle_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES planning_vehicles(id),
  driver_id UUID REFERENCES planning_drivers(id),
  route_id UUID REFERENCES planning_routes(id) ON DELETE SET NULL,
  captured_at TIMESTAMPTZ NOT NULL,
  latitude NUMERIC(10, 7) NOT NULL,
  longitude NUMERIC(10, 7) NOT NULL,
  speed_kph NUMERIC(8, 2),
  heading_degrees NUMERIC(6, 2),
  accuracy_meters NUMERIC(8, 2),
  battery_pct NUMERIC(5, 2),
  source TEXT NOT NULL DEFAULT 'driver_mobile',
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_planning_vehicle_telemetry_route_time
  ON planning_vehicle_telemetry (route_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_planning_vehicle_telemetry_vehicle_time
  ON planning_vehicle_telemetry (vehicle_id, captured_at DESC);

CREATE TABLE IF NOT EXISTS planning_eta_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES planning_routes(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES planning_route_stops(id) ON DELETE CASCADE,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provider_name TEXT,
  planned_eta_at TIMESTAMPTZ,
  live_eta_at TIMESTAMPTZ,
  eta_variance_minutes INTEGER,
  traffic_delay_minutes INTEGER DEFAULT 0,
  source_payload JSONB
);

CREATE INDEX IF NOT EXISTS idx_planning_eta_snapshots_route_time
  ON planning_eta_snapshots (route_id, calculated_at DESC);

-- -----------------------------------------------------------------------------
-- Audit Events
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS planning_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action audit_action NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  route_id UUID REFERENCES planning_routes(id) ON DELETE SET NULL,
  order_id UUID REFERENCES planning_orders(id) ON DELETE SET NULL,
  stop_id UUID REFERENCES planning_route_stops(id) ON DELETE SET NULL,
  performed_by TEXT,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT,
  before_value JSONB,
  after_value JSONB,
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_planning_audit_events_route_time
  ON planning_audit_events (route_id, performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_planning_audit_events_entity_time
  ON planning_audit_events (entity_type, entity_id, performed_at DESC);
CREATE INDEX IF NOT EXISTS idx_planning_audit_events_action_time
  ON planning_audit_events (action, performed_at DESC);

-- -----------------------------------------------------------------------------
-- Useful read views
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW planning_route_summary_vw AS
SELECT
  r.id AS route_id,
  r.route_code,
  r.route_date,
  r.depot_code,
  r.geo_zone_code,
  r.status,
  v.vehicle_code,
  v.plate_number,
  d.driver_name,
  COUNT(DISTINCT s.id) AS stop_count,
  COUNT(DISTINCT so.order_id) AS order_count,
  r.total_cases,
  r.total_weight_kg,
  r.total_cbm,
  r.total_ef_units,
  r.weight_utilization_pct,
  r.cbm_utilization_pct,
  r.ef_utilization_pct,
  r.planned_distance_km,
  r.planned_duration_minutes,
  r.planned_cost
FROM planning_routes r
LEFT JOIN planning_vehicles v ON v.id = r.vehicle_id
LEFT JOIN planning_drivers d ON d.id = r.driver_id
LEFT JOIN planning_route_stops s ON s.route_id = r.id
LEFT JOIN planning_stop_orders so ON so.stop_id = s.id
GROUP BY r.id, v.vehicle_code, v.plate_number, d.driver_name;
