import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { defaultSelection } from "@/lib/cart/pricing";
import { formatPriceCompact } from "@/lib/money";
import { startingPriceCents } from "@/lib/products";
import type { Product } from "@/content/types";
import { ConceptTag, ProductImageView } from "./ProductImageView";

function Visual({ product, aspect, rotation, className = "" }: { product: Product; aspect: number; rotation: number; className?: string }) {
  const image = product.images[0]!;
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: String(aspect) }}>
      <Link
        href={`/messer/${product.slug}`}
        className="group surface-hammered absolute inset-0 block overflow-hidden rounded-[3px] bg-anthracite"
        style={{ backgroundImage: "radial-gradient(ellipse 65% 60% at 62% 62%, rgb(198 132 76 / 0.24), transparent 68%)" }}
        aria-label={`${product.name} ansehen`}
      >
        <ProductImageView
          product={product}
          image={image}
          selection={defaultSelection(product)}
          aspect={aspect}
          rotation={rotation}
          decorative
          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
      </Link>
      {image.kind === "illustration" ? <ConceptTag className="pointer-events-none absolute bottom-3 left-3" /> : null}
    </div>
  );
}

function Specs({ product }: { product: Product }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[0.9375rem]">
      <dt className="text-fog">Klinge</dt>
      <dd>{product.specs.bladeLengthMm} mm</dd>
      <dt className="text-fog">Gesamt</dt>
      <dd>{product.specs.overallLengthMm} mm</dd>
      <dt className="text-fog">Stahl</dt>
      <dd>{product.specs.steel.replace(" (Beispielangabe)", "")}</dd>
    </dl>
  );
}

function PriceLine({ product }: { product: Product }) {
  return (
    <div>
      <p className="font-display text-3xl font-semibold tabular-nums">
        <span className="mr-1.5 text-base font-normal text-fog">ab</span>
        {formatPriceCompact(startingPriceCents(product))}
      </p>
      <p className="text-[0.8125rem] text-fog">Beispielpreis · {product.availability.label}</p>
    </div>
  );
}

/**
 * Messerauswahl in bewusst unterschiedlichen Kompositionen (kein Kachelraster):
 * 1 = Bild groß links, 2 = Bild rechts und nach unten versetzt, 3 = breites Band mit dreispaltigem Text.
 */
export function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <div className="space-y-24 sm:space-y-32">
      {products.map((product, i) => {
        const index = String(i + 1).padStart(2, "0");
        const layout = i % 3;

        if (layout === 0) {
          return (
            <Reveal key={product.slug} className="grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <Visual product={product} aspect={3 / 2} rotation={-12} />
              </div>
              <div className="lg:col-span-5 lg:pb-6">
                <p className="eyebrow text-copper">
                  {index} · {product.type}
                </p>
                <h3 className="display mt-3 text-[clamp(2.75rem,6vw,4.5rem)]">{product.name}</h3>
                <p className="font-display mt-2 text-xl italic text-fog">{product.tagline}</p>
                <p className="prose-copy mt-5 text-bone/90">{product.summary}</p>
                <div className="mt-6">
                  <Specs product={product} />
                </div>
                <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
                  <PriceLine product={product} />
                  <ButtonLink href={`/messer/${product.slug}`} variant="secondary">
                    Zum Messer <ArrowRightIcon size={18} />
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          );
        }

        if (layout === 1) {
          return (
            <Reveal key={product.slug} className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="order-2 lg:order-1 lg:col-span-5 lg:pt-24">
                <p className="eyebrow text-copper">
                  {index} · {product.type}
                </p>
                <h3 className="display mt-3 text-[clamp(2.75rem,6vw,4.5rem)]">{product.name}</h3>
                <p className="font-display mt-2 text-xl italic text-fog">{product.tagline}</p>
                <p className="prose-copy mt-5 text-bone/90">{product.summary}</p>
                <div className="mt-6">
                  <Specs product={product} />
                </div>
                <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
                  <PriceLine product={product} />
                  <ButtonLink href={`/messer/${product.slug}`} variant="secondary">
                    Zum Messer <ArrowRightIcon size={18} />
                  </ButtonLink>
                </div>
              </div>
              <div className="order-1 lg:order-2 lg:col-span-7">
                <Visual product={product} aspect={4 / 3} rotation={-5} />
              </div>
            </Reveal>
          );
        }

        return (
          <Reveal key={product.slug}>
            <Visual product={product} aspect={21 / 9} rotation={-8} className="!aspect-[3/2] sm:!aspect-[21/9]" />
            <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <p className="eyebrow text-copper">
                  {index} · {product.type}
                </p>
                <h3 className="display mt-3 text-[clamp(2.75rem,6vw,4.5rem)]">{product.name}</h3>
                <p className="font-display mt-2 text-xl italic text-fog">{product.tagline}</p>
              </div>
              <div className="lg:col-span-4">
                <p className="prose-copy text-bone/90">{product.summary}</p>
                <div className="mt-5">
                  <Specs product={product} />
                </div>
              </div>
              <div className="flex flex-col justify-between gap-6 lg:col-span-3">
                <PriceLine product={product} />
                <ButtonLink href={`/messer/${product.slug}`} variant="secondary">
                  Zum Messer <ArrowRightIcon size={18} />
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}
