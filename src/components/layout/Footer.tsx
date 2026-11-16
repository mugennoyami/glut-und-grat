import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/content/site";

export function Footer() {
  const { contact } = site;
  return (
    <footer className="surface-hammered mt-0 border-t border-bone/10 bg-forge">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:gap-8 md:py-20">
        <div className="md:col-span-5">
          <Wordmark size="lg" />
          <p className="font-display mt-5 max-w-sm text-xl italic text-fog">{site.claim}</p>
          <p className="mt-6 max-w-sm text-sm text-fog">
            Handgeschmiedete Messer, Schärfservice sowie individuelle Griffe und Scheiden.
          </p>
        </div>

        <nav aria-label="Seiten" className="md:col-span-2">
          <h2 className="eyebrow text-copper">Entdecken</h2>
          <ul className="mt-4 space-y-1">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center hover:text-copper">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/warenkorb" className="inline-flex min-h-10 items-center hover:text-copper">
                Warenkorb
              </Link>
            </li>
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-copper">Kontakt</h2>
          <ul className="mt-4 space-y-2 text-[0.9375rem]">
            <li>
              <Link href="/kontakt" className="underline underline-offset-4 hover:text-copper">
                Kontaktformular
              </Link>
            </li>
            <li className="text-fog">
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-copper">
                  {contact.email}
                </a>
              ) : (
                <>E-Mail: <span className="text-bone/80">[noch festzulegen]</span></>
              )}
            </li>
            <li className="text-fog">
              Anschrift: <span className="text-bone/80">[noch festzulegen]</span>
            </li>
          </ul>
        </div>

        <nav aria-label="Rechtliches" className="md:col-span-2">
          <h2 className="eyebrow text-copper">Rechtliches</h2>
          <ul className="mt-4 space-y-1">
            {site.legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center hover:text-copper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-bone/10">
        <div className="wrap flex flex-col gap-2 py-5 text-[0.8125rem] text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Glut &amp; Grat</p>
          {site.demo ? (
            <p>Demo-Vorschau: Produkte, Preise und Rechtstexte sind Platzhalter.</p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
