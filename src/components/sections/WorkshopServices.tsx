import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";
import { workshopServices } from "@/content/pages";

/** Kurze Einstiege; ausführliche Abläufe bleiben auf den jeweiligen Serviceseiten. */
export function WorkshopServices() {
  return (
    <section className="wrap py-20 sm:py-24" aria-labelledby="services-title">
      <p className="eyebrow text-copper">Die Werkstatt bleibt das Herz</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:items-end">
        <h2 id="services-title" className="display text-4xl sm:text-5xl">Handwerk für deine Geschichte.</h2>
        <p className="text-fog">Glut & Grat ist die Werkstatt von Meisterschmied David. Neben den kommenden Kollektionen bleiben Messer, Schärfservice und individuelle Griffe und Scheiden Teil der Schmiede.</p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {workshopServices.map(s => <article key={s.id} id={s.id} className="scroll-mt-24 border border-copper/20 bg-forge p-7"><p className="eyebrow text-copper">{s.eyebrow}</p><h3 className="mt-5 font-display text-3xl">{s.title}</h3><p className="mt-4 text-sm text-fog">{s.text}</p><Link href={s.href} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4 hover:text-copper">{s.action}<ArrowRightIcon size={16} /></Link></article>)}
      </div>
      <p className="mt-7 text-sm text-fog">Auch weiterhin im Demo-Shop: <Link href="/messer" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-copper">Messer für Alltag & Lagerküche →</Link></p>
    </section>
  );
}
