import { InfoIcon } from "@/components/ui/icons";

interface Props {
  title: string;
  needed: readonly string[];
  facts?: readonly string[] | undefined;
}

/**
 * Platzhalterseite für rechtliche Texte. Es werden bewusst keine Rechtstexte erfunden:
 * Die Seite benennt, was fehlt, damit nichts versehentlich als fertig gilt.
 */
export function LegalPage({ title, needed, facts }: Props) {
  return (
    <div className="wrap-narrow py-16 sm:py-24">
      <p className="eyebrow text-copper">Rechtliches</p>
      <h1 className="display mt-4 text-[clamp(2.1rem,6vw,4rem)]">{title}</h1>

      <div role="note" className="mt-8 flex gap-3.5 rounded-[3px] border-2 border-ember bg-ember/10 p-5">
        <InfoIcon size={24} className="mt-0.5 shrink-0 text-ember-soft" />
        <div>
          <p className="font-semibold">Platzhalter – dies ist kein Rechtstext.</p>
          <p className="mt-1 text-bone/90">
            Diese Angaben fehlen noch und müssen vor der Live-Schaltung von der Betreiberin oder dem Betreiber ergänzt und fachkundig geprüft werden. Bis dahin
            gibt es keine verbindlichen Aussagen.
          </p>
        </div>
      </div>

      <h2 className="font-display mt-12 text-2xl font-semibold">Offene Inhalte</h2>
      <ul className="mt-4 space-y-3">
        {needed.map((n) => (
          <li key={n} className="flex gap-3">
            <span className="mt-[0.8em] h-px w-5 shrink-0 bg-copper" aria-hidden="true" />
            <span>
              <span className="mr-2 rounded-[2px] border border-bone/30 px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-fog">offen</span>
              {n}
            </span>
          </li>
        ))}
      </ul>

      {facts && facts.length > 0 ? (
        <>
          <h2 className="font-display mt-12 text-2xl font-semibold">Technische Fakten dieser Vorschau</h2>
          <p className="mt-2 text-fog">Als Hilfe für die spätere Datenschutzerklärung, zum Stand dieser Vorschau:</p>
          <ul className="mt-4 space-y-3">
            {facts.map((f) => (
              <li key={f} className="flex gap-3">
                <span className="mt-[0.8em] h-px w-5 shrink-0 bg-copper" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
