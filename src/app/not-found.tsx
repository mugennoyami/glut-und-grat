import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="wrap py-28 sm:py-40">
      <p className="eyebrow text-copper">404</p>
      <h1 className="display mt-4 text-[clamp(2.75rem,7vw,5rem)]">Diese Seite ist erkaltet.</h1>
      <p className="prose-copy mt-5 text-lg text-fog">Unter dieser Adresse gibt es nichts. Vielleicht hilft einer dieser Wege weiter.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/" size="lg">
          Zur Startseite
        </ButtonLink>
        <ButtonLink href="/messer" variant="secondary" size="lg">
          Messer ansehen
        </ButtonLink>
      </div>
    </section>
  );
}
