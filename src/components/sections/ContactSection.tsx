import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRightIcon } from "@/components/ui/icons";
import { contactSection } from "@/content/pages";
import { site } from "@/content/site";
import { SectionHead } from "./SectionHead";

export function ContactSection({ heading = "h2" }: { heading?: "h1" | "h2" }) {
  return (
    <section id="kontakt" className="surface-hammered border-t border-bone/10 bg-forge" aria-labelledby="contact-title">
      <div className="wrap grid gap-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHead as={heading} id="contact-title" eyebrow={contactSection.eyebrow} title={contactSection.title} lead={contactSection.lead} />
          <ul className="mt-10 border-t border-bone/15">
            <li className="border-b border-bone/15">
              <Link href="/schaerfservice#anfrage" className="group flex min-h-16 items-center justify-between gap-4 py-4 hover:text-copper">
                <span>
                  <span className="font-display block text-xl font-semibold">Schärfservice anfragen</span>
                  <span className="text-sm text-fog">Klingentyp, Anzahl, Länge, Zustand</span>
                </span>
                <ArrowRightIcon size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
            <li className="border-b border-bone/15">
              <Link href="/massarbeit#anfrage" className="group flex min-h-16 items-center justify-between gap-4 py-4 hover:text-copper">
                <span>
                  <span className="font-display block text-xl font-semibold">Griff oder Scheide anfragen</span>
                  <span className="text-sm text-fog">Ausgangsprodukt, Material, Stil, Budget</span>
                </span>
                <ArrowRightIcon size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          </ul>
          <p className="mt-8 text-[0.9375rem] text-fog">
            {site.contact.email ? (
              <>
                Direkt per E-Mail:{" "}
                <a href={`mailto:${site.contact.email}`} className="text-bone underline underline-offset-4 hover:text-copper">
                  {site.contact.email}
                </a>
              </>
            ) : (
              <>Direkte Kontaktdaten (E-Mail, Telefon, Anschrift) sind noch nicht hinterlegt.</>
            )}
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={100}>
          <div className="rounded-[3px] border border-bone/15 bg-coal/60 p-6 sm:p-9">
            <h3 className="font-display mb-6 text-2xl font-semibold">Allgemeine Frage</h3>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
