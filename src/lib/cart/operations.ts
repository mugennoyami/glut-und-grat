import { getProduct } from "@/content/products";
import type { Product } from "@/content/types";
import { lineKey, resolveSelection } from "./pricing";
import type { CartLine } from "./types";

/** Reine Funktionen für Änderungen am Warenkorb – ohne React, ohne Speicher. */

function keyOf(line: CartLine): string {
  return lineKey(line.productId, line.options);
}

/** Normalisiert eine Auswahl: fehlende Optionen erhalten den Standardwert. */
export function completeSelection(product: Product, options: Record<string, string>): Record<string, string> {
  return Object.fromEntries(product.options.map((o) => [o.id, options[o.id] ?? o.defaultValueId]));
}

export function addLine(
  lines: CartLine[],
  product: Product,
  options: Record<string, string>,
  quantity = 1,
): CartLine[] {
  const complete = completeSelection(product, options);
  const resolved = resolveSelection(product, complete);
  if (!resolved.ok) return lines;

  const wanted = Math.max(1, Math.floor(quantity));
  const key = lineKey(product.slug, complete);
  const index = lines.findIndex((l) => keyOf(l) === key);
  if (index === -1) {
    return [...lines, { productId: product.slug, options: complete, quantity: Math.min(wanted, product.maxQuantity) }];
  }
  return lines.map((l, i) =>
    i === index ? { ...l, quantity: Math.min(l.quantity + wanted, product.maxQuantity) } : l,
  );
}

export function setLineQuantity(lines: CartLine[], key: string, quantity: number): CartLine[] {
  if (!Number.isFinite(quantity) || quantity < 1) return lines.filter((l) => keyOf(l) !== key);
  return lines.map((l) => {
    if (keyOf(l) !== key) return l;
    const product = getProduct(l.productId);
    const max = product?.maxQuantity ?? 1;
    return { ...l, quantity: Math.min(Math.floor(quantity), max) };
  });
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((l) => keyOf(l) !== key);
}

/**
 * Prüft gespeicherte Daten (z. B. aus localStorage) und entfernt alles, was nicht zum Katalog passt.
 * Verhindert, dass veraltete oder manipulierte Einträge den Warenkorb brechen.
 */
export function sanitizeStoredLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  let result: CartLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { productId, options, quantity } = item as Record<string, unknown>;
    if (typeof productId !== "string" || typeof quantity !== "number") continue;
    const product = getProduct(productId);
    if (!product) continue;
    const opts: Record<string, string> = {};
    if (options && typeof options === "object") {
      for (const [k, v] of Object.entries(options as Record<string, unknown>)) {
        if (typeof v === "string") opts[k] = v;
      }
    }
    if (!Number.isInteger(quantity) || quantity < 1) continue;
    result = addLine(result, product, opts, quantity);
  }
  return result;
}
