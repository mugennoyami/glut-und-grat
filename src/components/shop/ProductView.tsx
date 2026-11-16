"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { BagIcon } from "@/components/ui/icons";
import type { Product } from "@/content/types";
import { defaultSelection, resolveSelection } from "@/lib/cart/pricing";
import { formatPrice } from "@/lib/money";
import { useCart } from "./CartProvider";
import { OptionGroup } from "./OptionGroup";
import { ProductGallery } from "./ProductGallery";

const STATUS_DOT: Record<Product["availability"]["status"], string> = {
  made_to_order: "bg-copper",
  in_stock: "bg-emerald-500",
  sold_out: "bg-smoke",
};

/** Kernbereich der Produktseite: Galerie + Varianten + Preis + Warenkorb. */
export function ProductView({ product }: { product: Product }) {
  const { add } = useCart();
  const [selection, setSelection] = useState<Record<string, string>>(() => defaultSelection(product));
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  const resolved = resolveSelection(product, selection);
  const unitPrice = resolved.ok ? resolved.value.unitPriceCents : product.basePriceCents;
  const canBuy = resolved.ok && product.availability.status !== "sold_out";
  const { min, max } = product.availability.productionWeeks;

  useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const addToCart = () => {
    if (canBuy) add(product, selection, 1);
  };

  return (
    <section className="wrap pb-16 pt-6 sm:pt-10 lg:pb-24" aria-labelledby="product-title">
      <nav aria-label="Brotkrumen" className="mb-6 text-sm text-fog">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-copper">
              Start
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/messer" className="hover:text-copper">
              Messer
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-bone">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <div className="lg:sticky lg:top-28">
            <ProductGallery product={product} selection={selection} />
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow text-copper">{product.type}</p>
          <h1 id="product-title" className="display mt-3 text-[clamp(3rem,7vw,4.75rem)]">
            {product.name}
          </h1>
          <p className="font-display mt-3 text-xl italic text-fog">{product.tagline}</p>

          <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <p className="font-display text-4xl font-semibold tabular-nums" data-testid="product-price" aria-live="polite">
              {formatPrice(unitPrice)}
            </p>
            <p className="text-sm text-fog">Beispielpreis · zzgl. Versand (Beispiel)</p>
          </div>

          <p className="prose-copy mt-6 text-bone/90">{product.summary}</p>

          <form
            className="mt-8 space-y-7"
            onSubmit={(e) => {
              e.preventDefault();
              addToCart();
            }}
          >
            {product.options.map((option) => (
              <OptionGroup
                key={option.id}
                option={option}
                productSlug={product.slug}
                value={selection[option.id] ?? option.defaultValueId}
                onChange={(valueId) => setSelection((s) => ({ ...s, [option.id]: valueId }))}
              />
            ))}

            <div className="rounded-[3px] border border-bone/15 bg-anthracite/60 p-4">
              <p className="flex items-center gap-2.5 font-semibold">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT[product.availability.status]}`} aria-hidden="true" />
                {product.availability.label}
              </p>
              <dl className="mt-2.5 space-y-1 text-[0.9375rem] text-fog">
                <div className="flex flex-wrap gap-x-2">
                  <dt>Fertigungszeit:</dt>
                  <dd className="text-bone/90">
                    ca. {min}–{max} Wochen (Beispielangabe)
                  </dd>
                </div>
              </dl>
              <p className="mt-1 text-[0.8125rem] text-fog">{product.availability.note}</p>
            </div>

            <div ref={ctaRef}>
              <Button type="submit" size="lg" full disabled={!canBuy} data-testid="add-to-cart">
                <BagIcon size={20} />
                In den Warenkorb
              </Button>
              <p className="mt-3 text-[0.8125rem] text-fog">
                Beispielprodukt: Der Warenkorb ist bedienbar, bestellt oder bezahlt wird nichts.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Leiste: bleibt in Daumenreichweite, sobald der Hauptknopf aus dem Bild scrollt */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-bone/15 bg-coal/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!showBar}
      >
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold leading-tight">{product.name}</p>
            <p className="text-sm tabular-nums text-fog">{formatPrice(unitPrice)}</p>
          </div>
          <Button type="button" className="ml-auto" onClick={addToCart} disabled={!canBuy} tabIndex={showBar ? 0 : -1}>
            In den Warenkorb
          </Button>
        </div>
      </div>
    </section>
  );
}
