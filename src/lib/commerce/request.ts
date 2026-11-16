import { z } from "zod";
import type { CartSummary } from "@/lib/cart/pricing";

export const checkoutRequestSchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string().min(1).max(60),
        options: z.record(z.string().min(1).max(40), z.string().min(1).max(60)),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .max(50),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;

/** Öffentliche, schlanke Darstellung eines geprüften Warenkorbs (ohne Katalogobjekte). */
export interface QuoteDto {
  lines: {
    key: string;
    productId: string;
    name: string;
    selections: { optionLabel: string; valueLabel: string }[];
    unitPriceCents: number;
    quantity: number;
    lineTotalCents: number;
  }[];
  issues: { code: string; productId: string; message: string }[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}

export function toQuoteDto(summary: CartSummary): QuoteDto {
  return {
    lines: summary.lines.map((l) => ({
      key: l.key,
      productId: l.product.slug,
      name: l.product.name,
      selections: l.selections.map((s) => ({ optionLabel: s.optionLabel, valueLabel: s.valueLabel })),
      unitPriceCents: l.unitPriceCents,
      quantity: l.quantity,
      lineTotalCents: l.lineTotalCents,
    })),
    issues: summary.issues.map((i) => ({ code: i.code, productId: i.productId, message: i.message })),
    itemCount: summary.itemCount,
    subtotalCents: summary.subtotalCents,
    shippingCents: summary.shippingCents,
    totalCents: summary.totalCents,
  };
}
