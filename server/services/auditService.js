import { recordAuditEventRepository } from "../repositories/auditRepository.js";

export async function recordAuditEvent(event) {
  return recordAuditEventRepository(event);
}
