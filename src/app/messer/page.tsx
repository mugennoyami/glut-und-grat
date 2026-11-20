import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { ProductShowcase } from "@/components/shop/ProductShowcase";
import { products } from "@/content/products";

export const metadata: Metadata = {
  title: "Messer",
  description: "Drei kleine handgeschmiedete Messer als Demo-Sortiment: Funke, Esse und Zunder.",
};

export default function KnivesPage() {
  return (
    <>
      <section className="wrap pb-12 pt-14 sm:pt-20">
        <p className="eyebrow text-copper">Rüstkammer · Messer</p>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)]">Messer für Alltag & Lagerküche.</h1>
        <p className="prose-copy mt-6 text-lg text-bone/90">
          Klein im Programm, genau im Detail. Jedes Messer wird einzeln gefertigt. Preise, Maße und Fertigungszeiten sind in dieser Vorschau Beispieldaten.
        </p>
      </section>
      <section className="wrap pb-24 pt-8" aria-label="Messer im Überblick">
        <ProductShowcase products={products} />
      </section>
      <section className="border-t border-bone/10 bg-forge">
        <div className="wrap flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">Etwas anderes im Kopf?</h2>
            <p className="mt-2 text-fog">Griffe und Scheiden entstehen auch nach deinen Vorstellungen.</p>
          </div>
          <ButtonLink href="/massarbeit" variant="secondary">
            Maßarbeit anfragen
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
