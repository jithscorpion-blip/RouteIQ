import type { PlanningSnapshot } from "../types";
import { isPlanningSnapshot } from "./planningSnapshot";

export const ROUTEIQ_PLANNING_STORAGE_KEY = "routeiq.planning.snapshot.v1";

function hasBrowserStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPlanningSnapshot(): PlanningSnapshot | null {
  if (!hasBrowserStorage()) return null;
  try {
    const raw = window.localStorage.getItem(ROUTEIQ_PLANNING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isPlanningSnapshot(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function savePlanningSnapshot(snapshot: PlanningSnapshot): boolean {
  if (!hasBrowserStorage()) return false;
  try {
    window.localStorage.setItem(ROUTEIQ_PLANNING_STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

export function clearPlanningSnapshot(): boolean {
  if (!hasBrowserStorage()) return false;
  try {
    window.localStorage.removeItem(ROUTEIQ_PLANNING_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
