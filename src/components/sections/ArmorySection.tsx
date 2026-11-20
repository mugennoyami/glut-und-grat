import Link from "next/link";
import { ArmoryIllustration } from "@/components/art/ArmoryIllustration";
import { ArrowRightIcon } from "@/components/ui/icons";
import { armory, collections, useCases } from "@/content/collections";

export function CollectionGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {collections.map(c => (
        <Link key={c.slug} href={`/ruestkammer/${c.slug}`} className="collection-card group relative flex flex-col border border-copper/25 bg-forge transition-colors hover:border-copper">
          <div className="relative overflow-hidden border-b border-copper/15 bg-[#202923]">
            <span className="absolute left-4 top-4 font-display text-xl text-copper">{c.number}</span>
            <ArmoryIllustration motif={c.motif} className="w-full transition-transform duration-500 motion-safe:group-hover:scale-105" />
          </div>
          <div className="flex flex-1 flex-col px-5 py-6">
            <p className="text-[.65rem] font-semibold uppercase tracking-[.15em] text-copper">In Planung</p>
            <h3 className="mt-2 font-display text-2xl">{c.shortName}</h3>
            <p className="mt-3 flex-1 text-sm text-fog">{c.intro}</p>
            <span className="mt-6 flex items-center justify-between text-sm font-semibold">Kollektion entdecken <ArrowRightIcon size={18} /></span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ArmorySection() {
  return (
    <section id="ruestkammer" className="wrap py-20 sm:py-24" aria-labelledby="armory-title">
      <div className="mb-10 grid gap-5 md:grid-cols-2 md:items-end">
        <div><p className="eyebrow text-copper">01 · {armory.eyebrow}</p><h2 id="armory-title" className="display mt-4 text-4xl sm:text-5xl">{armory.title}</h2></div>
        <p className="max-w-lg text-fog">{armory.lead}</p>
      </div>
      <CollectionGrid />
      <p className="mt-5 max-w-4xl text-xs text-fog">{armory.planningNote}</p>
    </section>
  );
}

export function AdventureSection() {
  return (
    <section className="on-bone border-y border-copper/20" aria-labelledby="adventure-title">
      <div className="wrap py-16 sm:py-20">
        <p className="eyebrow text-copper-deep">Wohin führt dich dein Weg?</p>
        <h2 id="adventure-title" className="display mt-4 text-4xl sm:text-5xl">Nicht nur Ausrüstung. Ein Charakter.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {useCases.map((u, i) => <div key={u.title} className="border-t border-ink/25 pt-6"><span className="eyebrow text-copper-deep">0{i + 1}</span><h3 className="mt-3 font-display text-3xl">{u.title}</h3><p className="mt-3 text-ink-soft">{u.text}</p><Link className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4" href={u.href}>{u.action}<ArrowRightIcon size={16} /></Link></div>)}
        </div>
      </div>
    </section>
  );
}
