import Image from "next/image";
import { KnifeIllustration, type KnifeView } from "@/components/art/KnifeIllustration";
import { appearanceFor } from "@/lib/cart/appearance";
import type { Product, ProductImage } from "@/content/types";

interface Props {
  product: Product;
  image: ProductImage;
  /** Aktuelle Variantenauswahl – steuert Holz und Leder der Illustration */
  selection?: Record<string, string>;
  aspect?: number;
  rotation?: number;
  className?: string;
  glint?: boolean;
  /** true: Bild ist rein dekorativ (z. B. Vorschaubild neben Text) */
  decorative?: boolean;
}

/**
 * Zeigt ein Produktbild: echtes Foto, sobald eines in den Produktdaten hinterlegt ist,
 * sonst die generierte Konzeptillustration (gerendert passend zur gewählten Variante).
 */
export function ProductImageView({ product, image, selection = {}, aspect = 3 / 2, rotation, className, glint, decorative }: Props) {
  if (image.kind === "photo") {
    return (
      <Image
        src={image.src}
        alt={decorative ? "" : image.alt}
        width={image.width}
        height={image.height}
        className={className}
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    );
  }
  const look = appearanceFor(product, selection);
  const view: KnifeView = image.view;
  return (
    <KnifeIllustration
      dims={product.specs}
      art={product.art}
      view={view}
      aspect={aspect}
      glint={glint}
      {...(rotation !== undefined ? { rotation } : {})}
      {...look}
      className={className}
      {...(decorative ? {} : { title: image.alt })}
    />
  );
}

/** Kleiner Hinweis, dass es sich um eine Illustration und kein Foto handelt. */
export function ConceptTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-coal/70 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-fog backdrop-blur-sm ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-copper" aria-hidden="true" />
      Konzeptdarstellung
    </span>
  );
}
