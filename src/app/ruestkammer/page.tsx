import type { Metadata } from "next";
import Link from "next/link";
import { CollectionGrid, AdventureSection } from "@/components/sections/ArmorySection";
import { ProductShowcase } from "@/components/shop/ProductShowcase";
import { armory } from "@/content/collections";
import { products } from "@/content/products";

export const metadata: Metadata = { title: "Rüstkammer – Mittelalter, LARP & Katana", description: armory.lead };

export default function ArmoryPage() {
  return <>
    <section className="wrap py-16 sm:py-24">
      <p className="eyebrow text-copper">Mittelalter · Rollenspiel · Japan</p>
      <h1 className="display mt-5 text-5xl sm:text-7xl">Die Rüstkammer.</h1>
      <p className="prose-copy mt-6 text-lg text-fog">{armory.lead}</p>
      <nav aria-label="Sortiment" className="mt-8 flex flex-wrap gap-3"><a className="armory-chip" href="#kollektionen">Kommende Kollektionen</a><a className="armory-chip" href="#messer">Messer im Demo-Shop</a><Link className="armory-chip" href="/massarbeit">Individuelle Projekte</Link></nav>
      <div id="kollektionen" className="mt-14 scroll-mt-24"><h2 className="font-display mb-6 text-3xl">Vier Welten. Deine Geschichte.</h2><CollectionGrid /></div>
      <p className="mt-6 max-w-3xl text-sm text-fog">{armory.planningNote}</p>
    </section>
    <AdventureSection />
    <section id="messer" className="wrap scroll-mt-24 py-20" aria-labelledby="existing-title">
      <p className="eyebrow text-copper">Aus der bisherigen Werkstatt</p>
      <h2 id="existing-title" className="display mt-4 text-4xl">Messer für Alltag & Lagerküche.</h2>
      <p className="prose-copy mb-12 mt-5 text-fog">Funke, Esse und Zunder bleiben im Demo-Shop. Echte Schneidwerkzeuge für die Produktvorschau – keine LARP-Waffen. Preise und Angaben sind Beispieldaten.</p>
      <ProductShowcase products={products} />
    </section>
  </>;
}
