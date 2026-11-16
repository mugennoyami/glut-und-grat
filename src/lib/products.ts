import type { Product } from "@/content/types";

/** Günstigste mögliche Konfiguration eines Produkts (für „ab …“-Preise). */
export function startingPriceCents(product: Product): number {
  let price = product.basePriceCents;
  for (const option of product.options) {
    const deltas = option.values.filter((v) => v.available).map((v) => v.priceDeltaCents);
    if (deltas.length > 0) price += Math.min(...deltas);
  }
  return price;
}
