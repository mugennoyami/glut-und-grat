/** Suchmaschinen dürfen die Seite erst indexieren, wenn SITE_INDEXABLE=true gesetzt ist (Live-Schaltung). */
export function isIndexable(): boolean {
  return process.env.SITE_INDEXABLE === "true";
}
