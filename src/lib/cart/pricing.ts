import { products as defaultCatalog } from "@/content/products";
import { shopConfig } from "@/content/shop";
import type { Product } from "@/content/types";
import type { CartIssue, CartLine } from "./types";

export interface ResolvedSelection {
  optionId: string;
  optionLabel: string;
  valueId: string;
  valueLabel: string;
  priceDeltaCents: number;
}

export interface PricedLine {
  key: string;
  product: Product;
  selections: ResolvedSelection[];
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
}

export interface CartSummary {
  lines: PricedLine[];
  /** Probleme, die beim Prüfen aufgefallen sind (verworfene oder angepasste Positionen) */
  issues: CartIssue[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  /** Rest bis zur versandkostenfreien Lieferung, falls konfiguriert */
  freeShippingRemainingCents: number | null;
}

export interface ShippingConfig {
  flatRateCents: number;
  freeFromCents?: number | undefined;
}

/** Stabile Kennung einer Position: gleiche Auswahl ⇒ gleiche Position. */
export function lineKey(productId: string, options: Record<string, string>): string {
  const parts = Object.keys(options)
    .sort()
    .map((k) => `${k}=${options[k]}`);
  return `${productId}|${parts.join(";")}`;
}

/** Wählt für jede Option den Standardwert (für die erste Anzeige einer Produktseite). */
export function defaultSelection(product: Product): Record<string, string> {
  return Object.fromEntries(product.options.map((o) => [o.id, o.defaultValueId]));
}

export interface ResolveResult {
  selections: ResolvedSelection[];
  unitPriceCents: number;
}

/**
 * Löst eine Optionsauswahl gegen den Katalog auf und berechnet den Stückpreis.
 * Fehlende Optionen werden mit dem Standardwert belegt, unbekannte/nicht verfügbare abgelehnt.
 */
export function resolveSelection(
  product: Product,
  options: Record<string, string>,
): { ok: true; value: ResolveResult } | { ok: false; issue: CartIssue } {
  const knownIds = new Set(product.options.map((o) => o.id));
  for (const given of Object.keys(options)) {
    if (!knownIds.has(given)) {
      return {
        ok: false,
        issue: { code: "unknown_option", productId: product.slug, message: `Unbekannte Option „${given}“ bei ${product.name}.` },
      };
    }
  }

  const selections: ResolvedSelection[] = [];
  let unit = product.basePriceCents;
  for (const option of product.options) {
    const valueId = options[option.id] ?? option.defaultValueId;
    const value = option.values.find((v) => v.id === valueId);
    if (!value) {
      return {
        ok: false,
        issue: {
          code: "unknown_option_value",
          productId: product.slug,
          message: `Unbekannte Auswahl „${valueId}“ für ${option.label} bei ${product.name}.`,
        },
      };
    }
    if (!value.available) {
      return {
        ok: false,
        issue: {
          code: "option_unavailable",
          productId: product.slug,
          message: `${option.label} „${value.label}“ ist bei ${product.name} derzeit nicht verfügbar.`,
        },
      };
    }
    unit += value.priceDeltaCents;
    selections.push({
      optionId: option.id,
      optionLabel: option.label,
      valueId: value.id,
      valueLabel: value.label,
      priceDeltaCents: value.priceDeltaCents,
    });
  }
  return { ok: true, value: { selections, unitPriceCents: unit } };
}

/**
 * Berechnet den Warenkorb ausschließlich aus Katalogdaten.
 * Client und Server nutzen dieselbe Funktion – der Server ist die maßgebliche Instanz.
 */
export function priceCart(
  lines: CartLine[],
  options: { catalog?: Product[]; shipping?: ShippingConfig } = {},
): CartSummary {
  const catalog = options.catalog ?? defaultCatalog;
  const shipping = options.shipping ?? shopConfig.shipping;
  const issues: CartIssue[] = [];
  const priced = new Map<string, PricedLine>();

  for (const line of lines) {
    const product = catalog.find((p) => p.slug === line.productId);
    if (!product) {
      issues.push({ code: "unknown_product", productId: line.productId, message: `Produkt „${line.productId}“ existiert nicht.` });
      continue;
    }
    if (!Number.isInteger(line.quantity) || line.quantity < 1) {
      issues.push({ code: "invalid_quantity", productId: line.productId, message: `Ungültige Menge bei ${product.name}.` });
      continue;
    }
    const resolved = resolveSelection(product, line.options);
    if (!resolved.ok) {
      issues.push(resolved.issue);
      continue;
    }

    const key = lineKey(
      product.slug,
      Object.fromEntries(resolved.value.selections.map((s) => [s.optionId, s.valueId])),
    );
    const existing = priced.get(key);
    const requested = (existing?.quantity ?? 0) + line.quantity;
    const quantity = Math.min(requested, product.maxQuantity);
    if (requested > product.maxQuantity) {
      issues.push({
        code: "quantity_reduced",
        productId: product.slug,
        message: `Von ${product.name} sind maximal ${product.maxQuantity} Stück pro Bestellung möglich.`,
      });
    }
    priced.set(key, {
      key,
      product,
      selections: resolved.value.selections,
      unitPriceCents: resolved.value.unitPriceCents,
      quantity,
      lineTotalCents: resolved.value.unitPriceCents * quantity,
    });
  }

  const resultLines = [...priced.values()];
  const subtotalCents = resultLines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const itemCount = resultLines.reduce((sum, l) => sum + l.quantity, 0);
  const freeFrom = shipping.freeFromCents;
  const qualifiesForFree = freeFrom !== undefined && subtotalCents >= freeFrom;
  const shippingCents = resultLines.length === 0 || qualifiesForFree ? 0 : shipping.flatRateCents;

  return {
    lines: resultLines,
    issues,
    itemCount,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    freeShippingRemainingCents:
      freeFrom !== undefined && resultLines.length > 0 && !qualifiesForFree ? freeFrom - subtotalCents : null,
  };
}
