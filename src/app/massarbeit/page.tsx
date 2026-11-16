import type { Metadata } from "next";
import { Suspense } from "react";
import { CustomWorkForm } from "@/components/forms/CustomWorkForm";
import { MaterialExplorer } from "@/components/sections/MaterialExplorer";
import { ProcessList } from "@/components/sections/ProcessList";
import { Caps } from "@/components/ui/Caps";
import { customWork } from "@/content/pages";

export const metadata: Metadata = {
  title: "Maßarbeit: Griffe und Scheiden",
  description: "Individuelle Griffe und Scheiden: Projektanfrage mit Ausgangsprodukt, Material, Stil, Budgetrahmen und Beschreibung.",
};

export default function CustomWorkPage() {
  return (
    <>
      <section className="wrap pb-14 pt-14 sm:pt-20">
        <p className="eyebrow text-copper">
          <Caps>Maßarbeit</Caps>
        </p>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)]">{customWork.title}</h1>
        <p className="prose-copy mt-6 text-lg text-bone/90">{customWork.pageLead}</p>
      </section>

      <section className="wrap pb-20" aria-label="Materialprobe">
        <MaterialExplorer />
        <p className="mt-5 max-w-3xl text-[0.8125rem] text-fog">{customWork.materialNote}</p>
      </section>

      <section className="wrap grid gap-14 pb-24 lg:grid-cols-12 lg:gap-16" aria-label="Ablauf und Projektanfrage">
        <div className="lg:col-span-5">
          <h2 className="eyebrow text-fog">So läuft ein Projekt ab</h2>
          <div className="mt-2">
            <ProcessList steps={customWork.steps} />
          </div>
          <ul className="mt-10 space-y-6">
            {customWork.topics.map((t) => (
              <li key={t.title}>
                <h3 className="font-display text-2xl font-semibold">{t.title}</h3>
                <p className="mt-1 text-fog">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
        <div id="anfrage" className="scroll-mt-24 lg:col-span-7">
          <div className="surface-hammered rounded-[3px] border border-bone/15 bg-forge p-6 sm:p-9">
            <h2 className="font-display text-3xl font-semibold">Projektanfrage</h2>
            <p className="mt-2 mb-7 text-fog">Felder mit * sind Pflichtfelder.</p>
            <Suspense fallback={<p className="text-fog">Formular wird geladen …</p>}>
              <CustomWorkForm />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
