import { KnifeIllustration } from "@/components/art/KnifeIllustration";
import { ConceptTag } from "@/components/shop/ProductImageView";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { sharpening } from "@/content/pages";
import { getProduct } from "@/content/products";
import { ProcessList } from "./ProcessList";
import { SectionHead } from "./SectionHead";

export function SharpeningSection() {
  const product = getProduct("esse")!;
  return (
    <section id="schaerfservice" className="on-bone relative overflow-hidden" aria-labelledby="sharpening-title">
      <div className="wrap grid gap-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHead id="sharpening-title" eyebrow={sharpening.eyebrow} title={sharpening.title} lead={sharpening.lead} tone="bone" />
          <h3 className="eyebrow mt-10 text-ink-soft">Das wird geschärft</h3>
          <ul className="mt-4 space-y-2.5">
            {sharpening.accepts.map((a) => (
              <li key={a} className="flex gap-3">
                <span className="mt-[0.8em] h-px w-5 shrink-0 bg-copper-deep" aria-hidden="true" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-l-2 border-copper-deep pl-4 text-[0.9375rem] text-ink-soft">{sharpening.note}</p>
          <div className="mt-9">
            <ButtonLink href="/schaerfservice#anfrage" tone="bone" size="lg">
              Schärfservice anfragen <ArrowRightIcon size={19} />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7 lg:pt-20" delay={120}>
          <figure
            className="surface-hammered relative aspect-[16/10] overflow-hidden rounded-[3px] bg-coal"
            style={{ backgroundImage: "radial-gradient(ellipse 70% 60% at 55% 62%, rgb(198 132 76 / 0.2), transparent 68%)" }}
          >
            <KnifeIllustration
              dims={product.specs}
              art={product.art}
              view="edge"
              aspect={16 / 10}
              title="Detail einer geschliffenen Klinge: Schneidfase und Schmiedehaut am Rücken (Konzeptdarstellung)"
              className="absolute inset-0 h-full w-full"
            />
            <ConceptTag className="absolute left-3 top-3" />
          </figure>
          <div className="mt-10">
            <h3 className="eyebrow mb-1 text-ink-soft">So läuft es ab</h3>
            <ProcessList steps={sharpening.steps} tone="bone" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
