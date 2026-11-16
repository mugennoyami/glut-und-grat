import type { Metadata } from "next";
import { ProcessList } from "@/components/sections/ProcessList";
import { ButtonLink } from "@/components/ui/Button";
import { InfoIcon } from "@/components/ui/icons";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { workshop } from "@/content/pages";

export const metadata: Metadata = {
  title: "Werkstatt",
  description: "Die Werkstatt von Glut & Grat: Handarbeit, Materialkenntnis und der Weg vom Stahl zum Messer.",
};

export default function WorkshopPage() {
  return (
    <>
      <section className="wrap pb-16 pt-14 sm:pt-20">
        <p className="eyebrow text-copper">Werkstatt</p>
        <h1 className="display mt-4 max-w-4xl text-[clamp(2.75rem,7vw,5.5rem)]">{workshop.title}</h1>
        <p className="prose-copy mt-6 text-lg text-bone/90">{workshop.lead}</p>
      </section>

      <section className="wrap grid gap-5 pb-24 sm:grid-cols-12" aria-label="Fotos">
        <PhotoSlot label="Platz für Werkstattfotos" aspect="3/2" className="sm:col-span-7" />
        <PhotoSlot label="Platz für ein Detailfoto" aspect="4/5" className="sm:col-span-5 sm:mt-14" />
      </section>

      <section className="border-y border-bone/10 bg-forge" aria-labelledby="stations-title">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:gap-16 lg:py-28">
          <div className="lg:col-span-4">
            <p className="eyebrow text-copper">Vom Stahl zum Messer</p>
            <h2 id="stations-title" className="display mt-4 text-4xl sm:text-5xl">
              Fünf Stationen.
            </h2>
            <p className="mt-5 text-[0.9375rem] text-fog">{workshop.stationsNote}</p>
          </div>
          <div className="lg:col-span-8">
            <ProcessList steps={workshop.stations} />
          </div>
        </div>
      </section>

      <section className="wrap py-20 lg:py-28" aria-labelledby="materials-title">
        <p className="eyebrow text-copper">Materialkunde</p>
        <h2 id="materials-title" className="display mt-4 text-4xl sm:text-5xl">
          Stahl, Holz, Leder.
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {workshop.materials.map((m, i) => (
            <div key={m.title} className={i === 1 ? "md:mt-12" : i === 2 ? "md:mt-24" : ""}>
              <h3 className="font-display border-t border-copper pt-4 text-3xl font-semibold">{m.title}</h3>
              <p className="prose-copy mt-3 text-fog">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-24" aria-label="Offene Inhalte">
        <div className="flex gap-3.5 rounded-[3px] border border-bone/20 bg-anthracite/60 p-6">
          <InfoIcon size={24} className="mt-0.5 shrink-0 text-copper" />
          <div>
            <p className="font-semibold">Noch offen</p>
            <p className="mt-1 max-w-2xl text-bone/90">{workshop.open}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/messer" size="lg">
            Messer entdecken
          </ButtonLink>
          <ButtonLink href="/massarbeit" variant="secondary" size="lg">
            Maßarbeit anfragen
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
