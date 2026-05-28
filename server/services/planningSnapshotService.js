import { getMemoryStore, persistMemoryStore } from "../db/databaseClient.js";

const DEFAULT_KEY = "default";

export async function getPlanningSnapshot(user) {
  const store = getMemoryStore();
  store.planningSnapshots = store.planningSnapshots || {};
  return store.planningSnapshots[user?.id || DEFAULT_KEY] || store.planningSnapshots[DEFAULT_KEY] || null;
}

export async function savePlanningSnapshotServer(snapshot, user) {
  const store = getMemoryStore();
  store.planningSnapshots = store.planningSnapshots || {};
  const saved = {
    ...snapshot,
    serverSavedAt: new Date().toISOString(),
    savedBy: user?.name || user?.id || "unknown",
    savedByRole: user?.role || "unknown",
  };
  store.planningSnapshots[user?.id || DEFAULT_KEY] = saved;
  store.planningSnapshots[DEFAULT_KEY] = saved;
  await persistMemoryStore();
  return saved;
}
