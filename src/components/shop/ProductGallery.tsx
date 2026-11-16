"use client";

import { useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import type { Product } from "@/content/types";
import { ConceptTag, ProductImageView } from "./ProductImageView";

interface Props {
  product: Product;
  selection: Record<string, string>;
}

/** Bildergalerie mit Vorschaubildern, Pfeiltasten und Wischgeste. Die Bilder folgen der Variantenauswahl. */
export function ProductGallery({ product, selection }: Props) {
  const [index, setIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const images = product.images;
  const image = images[index] ?? images[0]!;
  const total = images.length;

  const go = (next: number) => setIndex((next + total) % total);

  return (
    <div role="group" aria-roledescription="Bildergalerie" aria-label={`Bilder von ${product.name}`}>
      <figure
        className="surface-hammered relative aspect-[4/3] overflow-hidden rounded-[3px] bg-anthracite sm:aspect-[3/2]"
        style={{ backgroundImage: "radial-gradient(ellipse 70% 60% at 68% 58%, rgb(198 132 76 / 0.22), transparent 65%)" }}
        onTouchStart={(e) => {
          touchStart.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          const end = e.changedTouches[0]?.clientX;
          touchStart.current = null;
          if (start === null || end === undefined) return;
          const dx = end - start;
          if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
        }}
      >
        <ProductImageView
          product={product}
          image={image}
          selection={selection}
          aspect={3 / 2}
          className="absolute inset-0 h-full w-full"
        />
        {image.kind === "illustration" ? <ConceptTag className="absolute left-3 top-3" /> : null}

        <button
          type="button"
          onClick={() => go(index - 1)}
          className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-coal/70 text-bone backdrop-blur-sm transition-colors hover:text-copper"
          aria-label="Vorheriges Bild"
        >
          <ArrowLeftIcon size={20} />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-coal/70 text-bone backdrop-blur-sm transition-colors hover:text-copper"
          aria-label="Nächstes Bild"
        >
          <ArrowRightIcon size={20} />
        </button>

        <figcaption className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-xs text-fog">
          <span aria-live="polite" className="rounded-full bg-coal/70 px-2.5 py-1 backdrop-blur-sm">
            {index + 1} / {total} · {"caption" in image && image.caption ? image.caption : ""}
          </span>
        </figcaption>
      </figure>

      <ul className="mt-3 grid grid-cols-4 gap-2.5" aria-label="Bildauswahl">
        {images.map((img, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Bild ${i + 1} von ${total}: ${"caption" in img && img.caption ? img.caption : "Ansicht"}`}
              aria-current={i === index ? "true" : undefined}
              className={`surface-hammered relative block aspect-[3/2] w-full overflow-hidden rounded-[3px] bg-anthracite ring-offset-2 ring-offset-coal transition ${
                i === index ? "ring-2 ring-copper" : "opacity-70 ring-1 ring-bone/15 hover:opacity-100"
              }`}
            >
              <ProductImageView
                product={product}
                image={img}
                selection={selection}
                aspect={3 / 2}
                decorative
                className="absolute inset-0 h-full w-full"
              />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-fog">
        Die Abbildungen sind generierte Konzeptdarstellungen, keine Fotos des fertigen Messers. Farbe, Maserung und Schmiedespuren weichen beim
        Einzelstück ab.
      </p>
    </div>
  );
}
