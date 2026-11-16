import { ButtonLink } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { customWork } from "@/content/pages";
import { MaterialExplorer } from "./MaterialExplorer";
import { SectionHead } from "./SectionHead";

export function CustomSection() {
  return (
    <section id="massarbeit" className="surface-hammered bg-forge" aria-labelledby="custom-title">
      <div className="wrap py-24 sm:py-32">
        <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <SectionHead id="custom-title" eyebrow={customWork.eyebrow} title={customWork.title} lead={customWork.lead} className="lg:col-span-6" />
          <ul className="space-y-0 border-t border-bone/15 lg:col-span-5 lg:col-start-8 lg:mt-3">
            {customWork.topics.map((t) => (
              <li key={t.title} className="border-b border-bone/15 py-5">
                <h3 className="font-display text-2xl font-semibold">{t.title}</h3>
                <p className="mt-1 text-fog">{t.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-16" delay={80}>
          <MaterialExplorer />
          <p className="mt-5 max-w-3xl text-[0.8125rem] text-fog">{customWork.materialNote}</p>
        </Reveal>

        <Reveal className="mt-20 grid gap-10 lg:grid-cols-12" delay={80}>
          <div className="lg:col-span-4">
            <h3 className="eyebrow text-copper">So läuft ein Projekt ab</h3>
          </div>
          <ol className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {customWork.steps.map((s, i) => (
              <li key={s.title}>
                <span className="font-display text-3xl font-semibold text-copper" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="font-display mt-2 text-xl font-semibold">
                  <span className="sr-only">Schritt {i + 1}: </span>
                  {s.title}
                </h4>
                <p className="mt-2 text-[0.9375rem] text-fog">{s.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="mt-14">
          <ButtonLink href="/massarbeit#anfrage" size="lg">
            Projekt anfragen <ArrowRightIcon size={19} />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
