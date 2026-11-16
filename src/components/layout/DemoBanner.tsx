import { site } from "@/content/site";

/** Dauerhafter Demo-Hinweis, solange site.demo gesetzt ist. */
export function DemoBanner() {
  if (!site.demo) return null;
  return (
    <div role="note" className="border-b border-bone/10 bg-anthracite text-[0.8125rem] leading-snug text-fog">
      <div className="wrap flex items-center justify-center gap-2.5 py-2 text-center">
        <span className="shrink-0 rounded-[2px] bg-ember px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-coal">
          Demo
        </span>
        <p>
          Vorschau mit Beispieldaten – keine echten Angebote, <span className="whitespace-nowrap">keine Bestellungen.</span>
        </p>
      </div>
    </div>
  );
}
