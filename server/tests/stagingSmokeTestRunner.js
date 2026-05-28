import { startRouteIqServer } from "../index.js";
import { runPilotDataImportWorkflow } from "../importWorkflow/pilotDataImportWorkflow.js";

async function requestJson(baseUrl, path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { response, json };
}

function assertStep(condition, name, details = {}) {
  if (!condition) {
    const error = new Error(`P42 staging smoke test failed: ${name}`);
    error.details = details;
    throw error;
  }
  console.log(`✓ ${name}`);
}

async function runApiSmokeChecks(baseUrl) {
  const health = await requestJson(baseUrl, "/api/health");
  assertStep(health.response.ok && health.json?.ok, "backend health endpoint", health.json);

  const login = await requestJson(baseUrl, "/api/auth/demo-login", {
    method: "POST",
    body: { role: "Admin" },
  });
  const token = login.json?.data?.token;
  assertStep(login.response.ok && token, "demo admin login", login.json);

  const session = await requestJson(baseUrl, "/api/auth/session", { token });
  assertStep(session.response.ok && session.json?.data?.authenticated, "authenticated session", session.json);

  const routes = await requestJson(baseUrl, "/api/routes", { token });
  assertStep(routes.response.ok && Array.isArray(routes.json?.data), "route list endpoint", routes.json);

  const orders = await requestJson(baseUrl, "/api/orders", { token });
  assertStep(orders.response.ok && Array.isArray(orders.json?.data), "order list endpoint", orders.json);

  const schemas = await requestJson(baseUrl, "/api/import/schemas", { token });
  assertStep(schemas.response.ok && Array.isArray(schemas.json?.data), "import schema endpoint", schemas.json);

  const validate = await requestJson(baseUrl, "/api/import/validate", {
    method: "POST",
    token,
    body: {
      entityName: "customers",
      rows: [{ customerCode: "CUST-SMOKE", customerName: "Smoke Test Customer", latitude: 23.5, longitude: 58.4 }],
    },
  });
  assertStep(validate.response.ok && validate.json?.data?.ok, "import validation endpoint", validate.json);

  const livePlan = await requestJson(baseUrl, "/api/telemetry/live-plan", { token });
  assertStep(livePlan.response.ok && livePlan.json?.ok, "live tracking plan endpoint", livePlan.json);
}

export async function runStagingSmokeTest() {
  const importSummary = runPilotDataImportWorkflow();
  assertStep(importSummary.ok, "pilot data import validation", importSummary.totals);

  const { server, port } = await startRouteIqServer({ port: 0 });
  const baseUrl = `http://localhost:${port}`;

  try {
    await runApiSmokeChecks(baseUrl);
    console.log("\nRouteIQ P42 staging smoke test passed.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runStagingSmokeTest().catch((error) => {
    console.error(error.message);
    if (error.details) console.error(JSON.stringify(error.details, null, 2));
    process.exit(1);
  });
}
