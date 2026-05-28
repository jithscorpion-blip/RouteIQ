import assert from "node:assert/strict";
import { startRouteIqServer } from "../index.js";
import { serverConfig } from "../config/env.js";

const AUTH_HEADER = { Authorization: `Bearer ${serverConfig.demoAdminToken}` };

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...AUTH_HEADER,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
  });
  const payload = await response.json().catch(() => null);
  return { response, payload };
}

async function run() {
  const { server, port } = await startRouteIqServer({ port: 0 });
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const health = await request(baseUrl, "/api/health", { headers: {} });
    assert.equal(health.response.status, 200);
    assert.equal(health.payload.ok, true);


    const demoLogin = await request(baseUrl, "/api/auth/demo-login", {
      method: "POST",
      headers: {},
      body: JSON.stringify({ role: "Planner" }),
    });
    assert.equal(demoLogin.response.status, 200);
    assert.equal(demoLogin.payload.ok, true);
    assert.equal(demoLogin.payload.data.user.role, "Planner");
    assert.ok(demoLogin.payload.data.token);

    const livePlan = await request(baseUrl, "/api/telemetry/live-plan");
    assert.equal(livePlan.response.status, 200);
    assert.equal(livePlan.payload.ok, true);
    assert.equal(livePlan.payload.data.currentMode, "polling");

    const routes = await request(baseUrl, "/api/routes");
    assert.equal(routes.response.status, 200);
    assert.equal(routes.payload.ok, true);
    assert.ok(Array.isArray(routes.payload.data));

    const validation = await request(baseUrl, "/api/orders/assign", {
      method: "POST",
      body: JSON.stringify({}),
    });
    assert.equal(validation.response.status, 400);
    assert.equal(validation.payload.error.code, "VALIDATION_FAILED");

    const createRoute = await request(baseUrl, "/api/routes", {
      method: "POST",
      body: JSON.stringify({
        id: "ROUTE-TEST-001",
        depot: "RMS",
        vehicle: "TEST-VAN",
        driver: "Test Driver",
        plannedKm: 12,
        plannedMinutes: 45,
        totalCases: 120,
        totalWeightKg: 950,
        totalCbm: 4.5,
        totalEf: 0.75,
      }),
    });
    assert.equal(createRoute.response.status, 200);
    assert.equal(createRoute.payload.ok, true);

    const telemetry = await request(baseUrl, "/api/telemetry/location", {
      method: "POST",
      body: JSON.stringify({ routeId: "ROUTE-TEST-001", latitude: 23.588, longitude: 58.382, speedKph: 42 }),
    });
    assert.equal(telemetry.response.status, 200);
    assert.equal(telemetry.payload.ok, true);

    console.log("RouteIQ integration smoke tests passed.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
