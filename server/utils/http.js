import { createApiError, normalizeApiError } from "../errors/apiErrors.js";
import { serverConfig } from "../config/env.js";

export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw createApiError("INVALID_JSON_BODY");
  }
}

export function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": serverConfig.corsOrigin || "*",
    "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
  });
  res.end(body);
}

export function sendError(res, error) {
  const normalized = normalizeApiError(error);
  sendJson(res, normalized.statusCode, normalized.payload);
}
