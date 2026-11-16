import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { InfoIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/money";
import { shopConfig } from "@/content/shop";
import type { Product } from "@/content/types";

/** Technische Daten, Pflege, Lieferumfang und Versand – serverseitig gerendert. */
export function ProductDetails({ product }: { product: Product }) {
  const { specs, availability } = product;
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "Klingenlänge", value: `${specs.bladeLengthMm} mm` },
    { label: "Gesamtlänge", value: `${specs.overallLengthMm} mm` },
    { label: "Stahl", value: specs.steel },
    { label: "Griffmaterial", value: specs.handle },
    {
      label: "Fertigungszeit",
      value: `ca. ${availability.productionWeeks.min}–${availability.productionWeeks.max} Wochen (Beispielangabe)`,
    },
    { label: "Lieferstatus", value: availability.label },
  ];

  return (
    <section className="border-t border-bone/10 bg-forge" aria-labelledby="details-title">
      <div className="wrap grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-4">
          <p className="eyebrow text-copper">Daten &amp; Pflege</p>
          <h2 id="details-title" className="display mt-3 text-4xl sm:text-5xl">
            Was du wissen solltest.
          </h2>
          <div className="mt-6 flex gap-3 rounded-[3px] border border-copper/40 p-4 text-sm text-bone/90">
            <InfoIcon size={20} className="mt-0.5 shrink-0 text-copper" />
            <p>Alle Angaben sind Beispieldaten und noch keine bestätigten Eigenschaften oder Angebote.</p>
          </div>
        </div>

        <div className="lg:col-span-8">
          <dl className="divide-y divide-bone/10 border-y border-bone/10">
            {rows.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-sm text-fog">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-semibold">Pflege</h3>
              <ul className="mt-4 space-y-3 text-[0.9375rem] text-bone/90">
                {product.care.map((c) => (
                  <li key={c} className="flex gap-3">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-copper" aria-hidden="true" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-10">
              <div>
                <h3 className="font-display text-2xl font-semibold">Im Lieferumfang</h3>
                <ul className="mt-4 space-y-2 text-[0.9375rem] text-bone/90">
                  <li className="flex gap-3">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-copper" aria-hidden="true" />
                    <span>Messer „{product.name}“</span>
                  </li>
                  {product.included.map((c) => (
                    <li key={c} className="flex gap-3">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-copper" aria-hidden="true" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold">Versand</h3>
                <ul className="mt-4 space-y-3 text-[0.9375rem] text-bone/90">
                  {product.shippingNotes.map((n) => (
                    <li key={n} className="flex gap-3">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-copper" aria-hidden="true" />
                      <span>{n}</span>
                    </li>
                  ))}
                  <li className="flex gap-3 text-fog">
                    <span className="mt-2.5 h-px w-4 shrink-0 bg-copper" aria-hidden="true" />
                    <span>
                      Demo-Versand: {formatPrice(shopConfig.shipping.flatRateCents)} pauschal, nur {shopConfig.shipping.countries.join(", ")}.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 rounded-[3px] border border-bone/15 bg-anthracite/60 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl font-semibold">Anderer Griff, andere Scheide?</p>
              <p className="mt-1 text-fog">Dann frag eine individuelle Anfertigung an.</p>
            </div>
            <ButtonLink href="/massarbeit" variant="secondary">
              Maßarbeit anfragen
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm text-fog">
            Weitere Fragen zu Rückgabe oder Bezahlung? Siehe <Link href="/widerruf" className="underline underline-offset-4 hover:text-copper">Widerruf &amp; Rückgabe</Link> (Platzhalter).
          </p>
        </div>
      </div>
    </section>
  );
}
