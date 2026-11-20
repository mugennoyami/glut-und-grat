import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArmoryIllustration } from "@/components/art/ArmoryIllustration";
import { ButtonLink } from "@/components/ui/Button";
import { armory, collections } from "@/content/collections";

export const dynamicParams = false;
export function generateStaticParams() { return collections.map(c => ({ slug: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = collections.find(c => c.slug === slug);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collections.find(c => c.slug === slug);
  if (!c) notFound();
  return <>
    <section className="armory-hero border-b border-copper/20">
      <div className="wrap py-12 sm:py-16">
        <nav aria-label="Brotkrumennavigation" className="text-sm text-fog"><Link href="/ruestkammer" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-copper">Rüstkammer</Link><span aria-hidden="true"> / </span><span aria-current="page">{c.shortName}</span></nav>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div><p className="eyebrow mt-6 text-copper">Kollektion {c.number} · In Planung</p><h1 className="display mt-5 text-[clamp(2.8rem,5vw,4.8rem)]">{c.name}</h1><p className="mt-5 font-display text-2xl italic text-copper">{c.intro}</p><p className="mt-5 text-bone/85">{c.description}</p><div className="mt-8"><ButtonLink href={`/massarbeit?produkt=${c.slug}#anfrage`} size="lg">Interesse anfragen</ButtonLink></div></div>
          <figure><ArmoryIllustration motif={c.motif} className="mx-auto w-full max-w-xl" /><figcaption className="text-center text-xs text-fog">Konzeptdarstellung · kein erhältliches Produkt</figcaption></figure>
        </div>
      </div>
    </section>
    <section className="wrap py-16 sm:py-20" aria-labelledby="planned-title">
      <p className="eyebrow text-copper">Ein Ausblick</p><h2 id="planned-title" className="display mt-4 text-4xl">Das ist geplant.</h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">{c.pieces.map((p, i) => <article key={p.name} className="border border-copper/20 bg-forge p-7"><p className="eyebrow text-copper">0{i + 1} · Geplant</p><h3 className="mt-4 font-display text-3xl">{p.name}</h3><p className="mt-3 text-fog">{p.description}</p></article>)}</div>
      <div className="mt-10 border-l-2 border-copper pl-6"><h2 className="font-display text-2xl">Ausführung & Einsatz</h2><p className="mt-3 max-w-3xl text-fog">{c.note}</p><p className="mt-3 max-w-3xl text-sm text-fog">{armory.planningNote} Eine Anfrage ist keine Bestellung oder Reservierung.</p></div>
    </section>
    <section className="on-bone"><div className="wrap flex flex-col justify-between gap-6 py-12 md:flex-row md:items-center"><div><h2 className="font-display text-3xl">Dein Charakter beginnt mit einer Idee.</h2><p className="mt-3 text-ink-soft">Beschreib deinen Stil und den geplanten Einsatz. Was möglich ist, klären wir gemeinsam.</p></div><ButtonLink href={`/massarbeit?produkt=${c.slug}#anfrage`} tone="bone">Projekt beschreiben</ButtonLink></div></section>
    <nav aria-label="Weitere Kollektionen" className="wrap flex flex-wrap gap-3 py-10">{collections.filter(other => other.slug !== c.slug).map(other => <Link className="armory-chip" key={other.slug} href={`/ruestkammer/${other.slug}`}>{other.shortName} →</Link>)}</nav>
  </>;
}
