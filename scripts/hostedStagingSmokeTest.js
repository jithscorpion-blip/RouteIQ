const backendUrl = process.env.ROUTEIQ_BACKEND_URL || process.env.VITE_ROUTEIQ_API_BASE || process.env.VITE_ROUTEIQ_API_BASE_URL;
const frontendUrl = process.env.ROUTEIQ_FRONTEND_URL || "";
const token = process.env.ROUTEIQ_DEMO_ADMIN_TOKEN || "dev-admin-token";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function getJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let payload = null;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = { raw: text }; }
  if (!response.ok) throw new Error(`${url} failed with ${response.status}: ${text}`);
  return payload;
}

async function main() {
  assert(backendUrl, "Set ROUTEIQ_BACKEND_URL to your Render backend URL, for example https://routeiq-backend-staging.onrender.com");
  console.log(`RouteIQ hosted smoke test`);
  console.log(`Backend: ${backendUrl}`);
  if (frontendUrl) console.log(`Frontend: ${frontendUrl}`);

  const health = await getJson(`${backendUrl}/api/health`);
  assert(health.ok, "Health endpoint did not return ok=true");
  console.log(`✓ Backend health ok (${health.databaseMode})`);

  const users = await getJson(`${backendUrl}/api/auth/demo-users`);
  assert(users.ok && Array.isArray(users.data), "Demo users endpoint failed");
  console.log(`✓ Demo users ok`);

  const login = await getJson(`${backendUrl}/api/auth/demo-login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ role: "Admin" })
  });
  assert(login.ok && login.data?.token, "Demo login did not return a token");
  console.log(`✓ Demo login ok`);

  const schemas = await getJson(`${backendUrl}/api/import/schemas`, {
    headers: { authorization: `Bearer ${login.data.token || token}` }
  });
  assert(schemas.ok, "Import schema endpoint failed");
  console.log(`✓ Import schema ok`);

  const history = await getJson(`${backendUrl}/api/import/history`, {
    headers: { authorization: `Bearer ${login.data.token || token}` }
  });
  assert(history.ok, "Import history endpoint failed");
  console.log(`✓ Import history ok`);

  if (frontendUrl) {
    const frontend = await fetch(frontendUrl);
    assert(frontend.ok, `Frontend URL failed with ${frontend.status}`);
    console.log(`✓ Frontend URL reachable`);
  }

  console.log("Hosted staging smoke test passed.");
}

main().catch((error) => {
  console.error("Hosted staging smoke test failed:", error.message);
  process.exit(1);
});
