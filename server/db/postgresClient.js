import { serverConfig } from "../config/env.js";

let pool = null;
let pgModuleLoadAttempted = false;
let pgModule = null;

async function loadPgModule() {
  if (pgModuleLoadAttempted) return pgModule;
  pgModuleLoadAttempted = true;
  try {
    pgModule = await import("pg");
    return pgModule;
  } catch (error) {
    const message = [
      "PostgreSQL mode is enabled but the optional 'pg' package is not installed.",
      "Install it before production DB use: npm install pg",
      `Original error: ${error.message}`,
    ].join(" ");
    throw new Error(message);
  }
}

export async function getPostgresPool() {
  if (!serverConfig.databaseUrl) {
    throw new Error("DATABASE_URL is required for PostgreSQL mode.");
  }

  if (pool) return pool;

  const { Pool } = await loadPgModule();
  pool = new Pool({
    connectionString: serverConfig.databaseUrl,
    ssl: serverConfig.databaseSsl === "require" ? { rejectUnauthorized: false } : undefined,
    max: serverConfig.databasePoolMax,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  pool.on("error", (error) => {
    console.error("RouteIQ PostgreSQL pool error:", error.message);
  });

  return pool;
}

export async function queryPostgres(sql, params = []) {
  const activePool = await getPostgresPool();
  return activePool.query(sql, params);
}

export async function closePostgresPool() {
  if (!pool) return;
  await pool.end();
  pool = null;
}
