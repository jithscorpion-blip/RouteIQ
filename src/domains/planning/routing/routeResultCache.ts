export interface CachedRoutingResult<T = unknown> {
  key: string;
  createdAt: string;
  expiresAt: string;
  provider: "google-maps" | "mapbox" | "openrouteservice";
  result: T;
}

export function createCachedRoutingResult<T>(key: string, provider: CachedRoutingResult<T>["provider"], result: T, ttlMinutes: number): CachedRoutingResult<T> {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ttlMinutes * 60 * 1000);

  return {
    key,
    provider,
    result,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function isRoutingCacheValid(cached: CachedRoutingResult | null | undefined, now: Date = new Date()): boolean {
  if (!cached) return false;
  return new Date(cached.expiresAt).getTime() > now.getTime();
}
