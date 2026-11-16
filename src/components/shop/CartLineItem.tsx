"use client";

import Link from "next/link";
import { KnifeIllustration } from "@/components/art/KnifeIllustration";
import { TrashIcon } from "@/components/ui/icons";
import { appearanceFor } from "@/lib/cart/appearance";
import type { PricedLine } from "@/lib/cart/pricing";
import { formatPrice } from "@/lib/money";
import { useCart } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";

/** Eine Warenkorb-Position – gleiche Komponente für Schublade und Warenkorb-Seite. */
export function CartLineItem({ line, compact = false }: { line: PricedLine; compact?: boolean }) {
  const { setQuantity, remove } = useCart();
  const selection = Object.fromEntries(line.selections.map((s) => [s.optionId, s.valueId]));
  const look = appearanceFor(line.product, selection);
  const thumb = compact ? "h-20 w-20" : "h-24 w-24 sm:h-32 sm:w-32";

  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/messer/${line.product.slug}`}
        className={`${thumb} surface-hammered relative shrink-0 overflow-hidden rounded-[3px] bg-anthracite`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <KnifeIllustration
          dims={line.product.specs}
          art={line.product.art}
          aspect={1}
          rotation={-24}
          className="h-full w-full"
          {...look}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/messer/${line.product.slug}`}
              className="font-display text-xl font-semibold leading-tight hover:text-copper"
            >
              {line.product.name}
            </Link>
            <p className="text-sm text-fog">{line.product.type}</p>
          </div>
          <p className="shrink-0 text-right font-semibold tabular-nums">{formatPrice(line.lineTotalCents)}</p>
        </div>

        <dl className="mt-2 space-y-0.5 text-sm text-fog">
          {line.selections.map((s) => (
            <div key={s.optionId} className="flex gap-1.5">
              <dt>{s.optionLabel}:</dt>
              <dd className="text-bone/90">{s.valueLabel}</dd>
            </div>
          ))}
          <div className="flex gap-1.5">
            <dt>Einzelpreis:</dt>
            <dd className="tabular-nums text-bone/90">{formatPrice(line.unitPriceCents)} (Beispiel)</dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            value={line.quantity}
            max={line.product.maxQuantity}
            label={`${line.product.name}, ${line.selections.map((s) => s.valueLabel).join(", ")}`}
            onChange={(n) => setQuantity(line.key, n)}
          />
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-[3px] px-2 text-sm text-fog underline-offset-4 hover:text-ember-soft hover:underline"
            aria-label={`${line.product.name} aus dem Warenkorb entfernen`}
          >
            <TrashIcon size={17} />
            Entfernen
          </button>
        </div>
        {line.quantity >= line.product.maxQuantity ? (
          <p className="mt-2 text-xs text-fog">Maximal {line.product.maxQuantity} Stück pro Bestellung.</p>
        ) : null}
      </div>
    </li>
  );
}
