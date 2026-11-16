/**
 * Minimaler In-Memory-Ratenbegrenzer (pro Server-Instanz).
 * Nur ein Platzhalter gegen versehentliche Mehrfachabsendungen: Auf Serverless-Hosting
 * oder bei mehreren Instanzen greift er nicht verlässlich. Für den Livebetrieb Edge-/WAF-Limits
 * oder einen gemeinsamen Speicher (z. B. Redis/KV) verwenden.
 */
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return false;
}

export function resetRateLimits(): void {
  hits.clear();
}
