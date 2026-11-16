import type { ProcessStep } from "@/content/types";

/** Nummerierter Ablauf mit großen Ziffern; `tone` passt die Farben an den Hintergrund an. */
export function ProcessList({ steps, tone = "dark" }: { steps: ProcessStep[]; tone?: "dark" | "bone" }) {
  const num = tone === "bone" ? "text-copper-deep" : "text-copper";
  const line = tone === "bone" ? "border-ink/20" : "border-bone/15";
  const text = tone === "bone" ? "text-ink-soft" : "text-fog";
  return (
    <ol className={`border-t ${line}`}>
      {steps.map((step, i) => (
        <li key={step.title} className={`grid grid-cols-[3.25rem_1fr] gap-x-4 border-b py-6 sm:grid-cols-[5rem_1fr] ${line}`}>
          <span className={`font-display text-4xl font-semibold leading-none tabular-nums sm:text-5xl ${num}`} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-display text-2xl font-semibold leading-tight">
              <span className="sr-only">Schritt {i + 1}: </span>
              {step.title}
            </h3>
            <p className={`prose-copy mt-2 ${text}`}>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
