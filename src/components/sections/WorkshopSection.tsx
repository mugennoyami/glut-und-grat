import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Reveal } from "@/components/ui/Reveal";
import { workshop } from "@/content/pages";
import { SectionHead } from "./SectionHead";

export function WorkshopSection() {
  return (
    <section id="werkstatt" className="wrap py-24 sm:py-32" aria-labelledby="workshop-title">
      <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHead id="workshop-title" eyebrow={workshop.eyebrow} title={workshop.title} lead={workshop.lead} />
          <Link href="/werkstatt" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-[6px] hover:text-copper">
            Mehr zur Werkstatt <ArrowRightIcon size={18} />
          </Link>
        </div>
        <ul className="border-t border-bone/15 lg:col-span-5 lg:col-start-8">
          {workshop.principles.map((p) => (
            <li key={p.title} className="border-b border-bone/15 py-6">
              <h3 className="font-display text-2xl font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-fog">{p.text}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-16 grid gap-5 sm:grid-cols-12" delay={80}>
        <PhotoSlot label="Platz für Werkstattfotos" aspect="4/5" className="sm:col-span-4" />
        <PhotoSlot label="Platz für Fotos vom Schmieden" aspect="3/2" className="sm:col-span-8 sm:mt-16" />
      </Reveal>
    </section>
  );
}
