import crypto from "node:crypto";
import { serverConfig } from "../config/env.js";
import { ROUTEIQ_ROLES } from "./roles.js";
import { findDemoUserByRole } from "./demoUsers.js";

function base64url(input) {
  return Buffer.from(JSON.stringify(input)).toString("base64url");
}

function sign(payload) {
  return crypto.createHmac("sha256", serverConfig.authSecret).update(payload).digest("base64url");
}

export function createRouteIqToken(user) {
  if (!ROUTEIQ_ROLES.includes(user.role)) {
    throw new Error(`Unsupported RouteIQ role: ${user.role}`);
  }
  const header = base64url({ alg: "HS256", typ: "JWT" });
  const body = base64url({ ...user, iat: Math.floor(Date.now() / 1000) });
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifyRouteIqToken(token) {
  if (!token) return null;
  if (serverConfig.nodeEnv === "development" && token === serverConfig.demoAdminToken) {
    return { id: "dev-admin", name: "Development Admin", role: "Admin" };
  }
  const [header, body, signature] = token.split(".");
  if (!header || !body || !signature) return null;
  const expected = sign(`${header}.${body}`);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
}

export function createDemoLoginSession(role = "Viewer") {
  const user = findDemoUserByRole(role);
  return {
    user,
    token: createRouteIqToken(user),
    mode: "demo-placeholder",
    issuedAt: new Date().toISOString(),
  };
}
