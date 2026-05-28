export function getEnv(name, fallback = "") {
  return process.env[name] ?? fallback;
}

export function getBooleanEnv(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export const serverConfig = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  port: Number(getEnv("ROUTEIQ_SERVER_PORT", getEnv("PORT", "8787"))),
  authSecret: getEnv("ROUTEIQ_AUTH_SECRET", "dev-only-secret"),
  demoAdminToken: getEnv("ROUTEIQ_DEMO_ADMIN_TOKEN", "dev-admin-token"),
  databaseUrl: getEnv("DATABASE_URL", ""),
  databaseMode: getEnv("ROUTEIQ_DATABASE_MODE", "memory"),
  localStorePath: getEnv("ROUTEIQ_LOCAL_STORE_PATH", ""),
  databaseSsl: getEnv("ROUTEIQ_DATABASE_SSL", "prefer"),
  databasePoolMax: Number(getEnv("ROUTEIQ_DATABASE_POOL_MAX", "10")),
  allowMigrationExecution: getBooleanEnv("ROUTEIQ_RUN_MIGRATIONS", false),
  googleMapsApiKey: getEnv("GOOGLE_MAPS_API_KEY", ""),
  googleRoutesEndpoint: getEnv("GOOGLE_ROUTES_ENDPOINT", "https://routes.googleapis.com/directions/v2:computeRoutes"),
  enableLiveGoogleRoutes: getBooleanEnv("ROUTEIQ_ENABLE_LIVE_GOOGLE_ROUTES", false),
  routingProvider: getEnv("ROUTING_PROVIDER", "mock"),
  corsOrigin: getEnv("ROUTEIQ_CORS_ORIGIN", "*"),
};
