import { shopConfig } from "@/content/shop";

const formatter = new Intl.NumberFormat(shopConfig.locale, {
  style: "currency",
  currency: shopConfig.currency,
});

/** Formatiert einen Betrag in Cent als Euro-Betrag, z. B. 9800 → "98,00 €". */
export function formatPrice(cents: number): string {
  if (!Number.isFinite(cents)) return "–";
  return formatter.format(cents / 100);
}

/** Wie formatPrice, aber ohne Nachkommastellen bei ganzen Euro-Beträgen ("98 €"). */
export function formatPriceCompact(cents: number): string {
  if (cents % 100 === 0) {
    return new Intl.NumberFormat(shopConfig.locale, {
      style: "currency",
      currency: shopConfig.currency,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  }
  return formatPrice(cents);
}

export function formatSignedPrice(cents: number): string {
  if (cents === 0) return "inklusive";
  return `${cents > 0 ? "+" : "−"} ${formatPrice(Math.abs(cents))}`;
}
