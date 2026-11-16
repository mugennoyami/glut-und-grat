import { shopConfig } from "@/content/shop";
import type { CartSummary } from "@/lib/cart/pricing";
import { formatPrice } from "@/lib/money";

/** Summenblock. Alle Beträge stammen aus priceCart – es wird hier nichts selbst gerechnet. */
export function CartTotals({ summary, className = "" }: { summary: Pick<CartSummary, "subtotalCents" | "shippingCents" | "totalCents" | "freeShippingRemainingCents">; className?: string }) {
  return (
    <div className={`text-[0.9375rem] ${className}`}>
      <dl className="space-y-2">
        <div className="flex justify-between gap-4">
          <dt className="text-fog">Zwischensumme</dt>
          <dd className="tabular-nums" data-testid="subtotal">
            {formatPrice(summary.subtotalCents)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-fog">{shopConfig.shipping.label}</dt>
          <dd className="tabular-nums" data-testid="shipping">
            {summary.shippingCents === 0 ? "kostenfrei" : formatPrice(summary.shippingCents)}
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-t border-bone/20 pt-3 text-lg font-semibold">
          <dt>Gesamtsumme</dt>
          <dd className="tabular-nums" data-testid="total">
            {formatPrice(summary.totalCents)}
          </dd>
        </div>
      </dl>
      {summary.freeShippingRemainingCents !== null ? (
        <p className="mt-2 text-xs text-fog">Noch {formatPrice(summary.freeShippingRemainingCents)} bis zum kostenfreien Versand (Beispiel).</p>
      ) : null}
      <p className="mt-2 text-xs text-fog">Beispielpreise. Steuerausweis und endgültige Versandkosten stehen noch nicht fest.</p>
    </div>
  );
}
