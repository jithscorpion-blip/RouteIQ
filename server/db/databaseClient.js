import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serverConfig } from "../config/env.js";
import { queryPostgres } from "./postgresClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultStorePath = path.resolve(__dirname, "../data/routeiq-local-store.json");

const memoryStore = {
  routes: [],
  orders: [],
  telemetry: [],
  auditEvents: [],
  customers: [],
  vehicles: [],
  importedRoutes: [],
  importedOrders: [],
  importBatches: [],
  planningSnapshots: {},
  stopExecutionEvents: [],
};

let storeLoaded = false;

function getStorePath() {
  return serverConfig.localStorePath || defaultStorePath;
}

export function loadMemoryStore() {
  if (storeLoaded) return memoryStore;
  storeLoaded = true;
  try {
    const storePath = getStorePath();
    if (!fs.existsSync(storePath)) return memoryStore;
    const raw = fs.readFileSync(storePath, "utf8");
    const parsed = JSON.parse(raw);
    Object.assign(memoryStore, parsed);
  } catch (error) {
    console.warn("RouteIQ local store could not be loaded:", error.message);
  }
  return memoryStore;
}

export async function persistMemoryStore() {
  if (shouldUsePostgres()) return false;
  loadMemoryStore();
  const storePath = getStorePath();
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  fs.writeFileSync(storePath, JSON.stringify(memoryStore, null, 2));
  return true;
}

export function shouldUsePostgres() {
  return serverConfig.databaseMode === "postgres" && Boolean(serverConfig.databaseUrl);
}

export function getDatabaseMode() {
  if (shouldUsePostgres()) return "postgres";
  if (serverConfig.databaseUrl && serverConfig.databaseMode !== "postgres") return "database-url-configured-local-json-fallback";
  return "local-json-fallback";
}

export async function query(sql, params = []) {
  if (shouldUsePostgres()) {
    return queryPostgres(sql, params);
  }

  return {
    rows: [],
    rowCount: 0,
    sql,
    params,
    mode: getDatabaseMode(),
    note: "Memory fallback mode does not execute SQL. Enable ROUTEIQ_DATABASE_MODE=postgres with DATABASE_URL for real DB queries.",
  };
}

export async function transaction(work) {
  if (!shouldUsePostgres()) {
    return work({ query });
  }

  const { getPostgresPool } = await import("./postgresClient.js");
  const pool = await getPostgresPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function getMemoryStore() {
  return loadMemoryStore();
}

export function getLocalStorePath() {
  return getStorePath();
}
