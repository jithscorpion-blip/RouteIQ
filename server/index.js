import http from "node:http";
import { serverConfig } from "./config/env.js";
import { sendError, sendJson } from "./utils/http.js";
import { handlePlanningRoute } from "./routes/planningRoutes.js";
import { createApiError } from "./errors/apiErrors.js";

export function createRouteIqServer() {
  return http.createServer(async (req, res) => {
    try {
      if (req.method === "OPTIONS") return sendJson(res, 204, {});
      const url = new URL(req.url, `http://${req.headers.host}`);
      const handled = await handlePlanningRoute(req, res, url);
      if (handled === false) {
        return sendError(res, createApiError("ENDPOINT_NOT_FOUND"));
      }
    } catch (error) {
      return sendError(res, error);
    }
  });
}

export function startRouteIqServer({ port = serverConfig.port } = {}) {
  const server = createRouteIqServer();
  return new Promise((resolve) => {
    server.listen(port, () => {
      const address = server.address();
      const actualPort = typeof address === "object" && address ? address.port : port;
      console.log(`RouteIQ backend skeleton running on http://localhost:${actualPort}`);
      resolve({ server, port: actualPort });
    });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  startRouteIqServer();
}
