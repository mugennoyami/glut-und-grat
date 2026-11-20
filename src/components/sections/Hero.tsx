import { ArmoryIllustration } from "@/components/art/ArmoryIllustration";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { hero } from "@/content/pages";

export function Hero() {
  return (
    <section className="armory-hero relative isolate overflow-hidden border-b border-copper/25" aria-labelledby="hero-title">
      <div className="wrap grid items-center gap-4 py-14 lg:min-h-[660px] lg:grid-cols-2 lg:py-20">
        <div className="relative z-10">
          <p className="eyebrow flex items-center gap-3 text-copper"><span className="h-px w-8 bg-copper" aria-hidden="true" />{hero.eyebrow}</p>
          <h1 id="hero-title" className="display mt-7 text-[clamp(3.3rem,6.3vw,6rem)] leading-[1.02]">
            {hero.headline[0]}<br /><em className="font-normal text-copper">{hero.headline[1]}</em>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-bone/80">{hero.lead}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/ruestkammer" size="lg">Rüstkammer entdecken <ArrowRightIcon size={19} /></ButtonLink>
            <ButtonLink href="/ruestkammer/katana" variant="secondary" size="lg">Katana & Japan</ButtonLink>
          </div>
          <p className="mt-7 text-xs tracking-wide text-fog">Mittelaltermärkte · LARP · Historische Darstellung · Sammlung</p>
        </div>
        <figure className="crest-frame relative mx-auto w-full max-w-xl">
          <div className="crest-arch absolute inset-x-[12%] inset-y-[4%]" aria-hidden="true" />
          <ArmoryIllustration motif="crest" className="relative w-full drop-shadow-[0_22px_20px_rgba(0,0,0,.5)]" />
          <figcaption className="relative text-center text-xs text-fog">{hero.caption}</figcaption>
        </figure>
      </div>
      <div className="border-t border-copper/20 bg-coal/35">
        <div className="wrap flex flex-wrap justify-between gap-x-6 gap-y-3 py-5 text-xs uppercase tracking-[.16em] text-bone/80">
          <span>Stahl. Leder. Geschichten.</span><span>Die Werkstatt von David</span><span className="text-copper">Ein neues Kapitel für Glut & Grat</span>
        </div>
      </div>
    </section>
  );
}
