import type { Metadata } from "next";
import { SharpeningForm } from "@/components/forms/SharpeningForm";
import { ProcessList } from "@/components/sections/ProcessList";
import { sharpening } from "@/content/pages";

export const metadata: Metadata = {
  title: "Schärfservice",
  description: "Schärfservice für Küchenmesser, Taschenmesser und Outdoor-Klingen. Schwerter nach individueller Prüfung. Strukturierte Anfrage.",
};

export default function SharpeningPage() {
  return (
    <>
      <section className="wrap pb-14 pt-14 sm:pt-20">
        <p className="eyebrow text-copper">Schärfservice</p>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)]">{sharpening.title}</h1>
        <p className="prose-copy mt-6 text-lg text-bone/90">{sharpening.pageLead}</p>
      </section>

      <section className="wrap grid gap-14 pb-24 lg:grid-cols-12 lg:gap-16" aria-label="Ablauf und Anfrage">
        <div className="lg:col-span-5">
          <h2 className="eyebrow text-fog">So läuft es ab</h2>
          <div className="mt-2">
            <ProcessList steps={sharpening.steps} />
          </div>
          <h2 className="eyebrow mt-12 text-fog">Das wird geschärft</h2>
          <ul className="mt-4 space-y-2.5">
            {sharpening.accepts.map((a) => (
              <li key={a} className="flex gap-3">
                <span className="mt-[0.8em] h-px w-5 shrink-0 bg-copper" aria-hidden="true" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-l-2 border-copper pl-4 text-[0.9375rem] text-fog">{sharpening.note}</p>
        </div>

        <div id="anfrage" className="scroll-mt-24 lg:col-span-7">
          <div className="surface-hammered rounded-[3px] border border-bone/15 bg-forge p-6 sm:p-9">
            <h2 className="font-display text-3xl font-semibold">Schärfanfrage</h2>
            <p className="mt-2 mb-7 text-fog">Felder mit * sind Pflichtfelder.</p>
            <SharpeningForm />
          </div>
        </div>
      </section>
    </>
  );
}
