import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serverConfig } from "../config/env.js";
import { query, getDatabaseMode } from "./databaseClient.js";
import { closePostgresPool } from "./postgresClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const migrationsDir = path.join(projectRoot, "src/domains/planning/database/migrations");

function readMigrations() {
  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => ({
      file,
      path: path.join(migrationsDir, file),
      sql: fs.readFileSync(path.join(migrationsDir, file), "utf8"),
    }));
}

async function ensureMigrationTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS routeiq_schema_migrations (
      migration_name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function alreadyApplied(file) {
  const result = await query("SELECT migration_name FROM routeiq_schema_migrations WHERE migration_name = $1", [file]);
  return result.rows.length > 0;
}

async function markApplied(file) {
  await query("INSERT INTO routeiq_schema_migrations (migration_name) VALUES ($1) ON CONFLICT DO NOTHING", [file]);
}

async function main() {
  const migrations = readMigrations();
  const mode = getDatabaseMode();
  const execute = serverConfig.allowMigrationExecution && mode === "postgres";

  console.log(`RouteIQ migration runner`);
  console.log(`Mode: ${mode}`);
  console.log(`Execution enabled: ${execute ? "yes" : "no - dry run only"}`);
  console.log(`Migrations found: ${migrations.length}`);

  if (!execute) {
    for (const migration of migrations) {
      console.log(`DRY RUN: ${migration.file} (${migration.sql.length} chars)`);
    }
    console.log("Set ROUTEIQ_DATABASE_MODE=postgres, DATABASE_URL, and ROUTEIQ_RUN_MIGRATIONS=true to execute.");
    return;
  }

  await ensureMigrationTable();

  for (const migration of migrations) {
    if (await alreadyApplied(migration.file)) {
      console.log(`SKIP: ${migration.file}`);
      continue;
    }

    console.log(`APPLY: ${migration.file}`);
    await query(migration.sql);
    await markApplied(migration.file);
  }

  console.log("RouteIQ migrations completed.");
}

main()
  .catch((error) => {
    console.error("RouteIQ migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePostgresPool();
  });
