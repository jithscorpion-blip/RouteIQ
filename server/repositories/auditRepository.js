import { getMemoryStore, query, shouldUsePostgres } from "../db/databaseClient.js";

export async function recordAuditEventRepository(event) {
  const normalized = {
    id: event.id || `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    actorId: event.actorId || "system",
    action: event.action,
    entityType: event.entityType,
    entityId: event.entityId,
    before: event.before || null,
    after: event.after || null,
    createdAt: event.createdAt || new Date().toISOString(),
  };

  if (!shouldUsePostgres()) {
    getMemoryStore().auditEvents.push(normalized);
    return normalized;
  }

  const result = await query(
    `insert into planning_audit_events (
        audit_event_id, actor_id, action, entity_type, entity_id, before_payload, after_payload, created_at
      ) values ($1,$2,$3,$4,$5,$6::jsonb,$7::jsonb,$8)
      returning audit_event_id as id, actor_id as "actorId", action, entity_type as "entityType",
                entity_id as "entityId", before_payload as before, after_payload as after, created_at as "createdAt"`,
    [
      normalized.id,
      normalized.actorId,
      normalized.action,
      normalized.entityType,
      normalized.entityId,
      normalized.before ? JSON.stringify(normalized.before) : null,
      normalized.after ? JSON.stringify(normalized.after) : null,
      normalized.createdAt,
    ]
  );
  return result.rows[0];
}
