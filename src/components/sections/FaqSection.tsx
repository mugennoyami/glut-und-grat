import { PlusIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/content/pages";
import { SectionHead } from "./SectionHead";

export function FaqSection() {
  return (
    <section id="faq" className="on-bone" aria-labelledby="faq-title">
      <div className="wrap grid gap-12 py-24 sm:py-32 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHead
            id="faq-title"
            eyebrow="Fragen"
            title="Kurz beantwortet."
            lead="Alles, was vor einer Anfrage oder Bestellung wichtig ist."
            tone="bone"
          />
        </Reveal>
        <Reveal className="lg:col-span-8" delay={100}>
          <div className="border-t border-ink/20">
            {faq.map((item) => (
              <details key={item.question} className="group border-b border-ink/20">
                <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4 font-display text-xl font-semibold leading-snug hover:text-copper-deep sm:text-2xl">
                  {item.question}
                  <PlusIcon size={24} className="shrink-0 text-copper-deep transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="prose-copy pb-6 pr-10 text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
