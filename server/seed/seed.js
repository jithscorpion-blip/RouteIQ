import { getDatabaseMode, getMemoryStore, shouldUsePostgres } from "../db/databaseClient.js";
import { upsertRouteRepository } from "../repositories/routeRepository.js";
import { insertTelemetryPingRepository } from "../repositories/telemetryRepository.js";
import { seedOrders, seedRoutes, seedTelemetry } from "./seedData.js";
import { closePostgresPool } from "../db/postgresClient.js";

async function seedMemoryStore() {
  const store = getMemoryStore();
  store.routes = [...seedRoutes];
  store.orders = [...seedOrders];
  store.telemetry = [...seedTelemetry];
  store.auditEvents = [];
  return {
    routes: store.routes.length,
    orders: store.orders.length,
    telemetry: store.telemetry.length,
    mode: "memory-fallback",
  };
}

async function seedPostgresStore() {
  for (const route of seedRoutes) {
    await upsertRouteRepository(route);
  }

  for (const ping of seedTelemetry) {
    await insertTelemetryPingRepository(ping);
  }

  return {
    routes: seedRoutes.length,
    orders: "not inserted by this lightweight seed script yet",
    telemetry: seedTelemetry.length,
    mode: "postgres",
  };
}

async function main() {
  const mode = getDatabaseMode();
  const execute = process.env.ROUTEIQ_RUN_SEED === "true";

  console.log("RouteIQ seed runner");
  console.log(`Mode: ${mode}`);
  console.log(`Execution enabled: ${execute ? "yes" : "no - dry run only"}`);
  console.log(`Seed routes: ${seedRoutes.length}`);
  console.log(`Seed orders: ${seedOrders.length}`);
  console.log(`Seed telemetry pings: ${seedTelemetry.length}`);

  if (!execute) {
    console.log("Set ROUTEIQ_RUN_SEED=true to apply seed data.");
    return;
  }

  const result = shouldUsePostgres() ? await seedPostgresStore() : await seedMemoryStore();
  console.log("RouteIQ seed completed:", JSON.stringify(result, null, 2));
}

main()
  .catch((error) => {
    console.error("RouteIQ seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePostgresPool();
  });
