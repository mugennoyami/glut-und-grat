import { site } from "@/content/site";

/**
 * Schlichte typografische Wortmarke: GLUT & GRAT in gesperrten Versalien,
 * das „&“ als kupferfarbene Kursive – wie ein Schlagstempel, ohne Zusatzsymbol.
 */
export function Wordmark({ className = "", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  const sizes = size === "lg" ? "text-[1.7rem] sm:text-[2.1rem]" : "text-[1.02rem] sm:text-[1.12rem]";
  return (
    <span className={`font-display inline-flex items-baseline whitespace-nowrap font-semibold uppercase tracking-[0.2em] ${sizes} ${className}`}>
      <span className="sr-only">{site.name}</span>
      <span aria-hidden="true">Glut</span>
      <span aria-hidden="true" className="px-[0.5em] font-normal normal-case italic tracking-normal text-copper">
        &amp;
      </span>
      <span aria-hidden="true">Grat</span>
    </span>
  );
}
