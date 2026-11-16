import { seededRandom } from "./knife-geometry";

/** Aufsteigende Funken – rein dekorativ, deterministisch (kein Hydration-Unterschied), per CSS animiert. */
const rand = seededRandom(2026);
const EMBERS = Array.from({ length: 22 }, () => ({
  left: 8 + rand() * 84,
  bottom: rand() * 28,
  size: 2 + rand() * 3.4,
  dx: -60 + rand() * 120,
  rise: -(180 + rand() * 360),
  dur: 5.5 + rand() * 6,
  delay: -rand() * 11,
}));

export function EmberField({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="ember absolute rounded-full bg-ember-soft opacity-0"
          style={
            {
              left: `${e.left}%`,
              bottom: `${e.bottom}%`,
              width: `${e.size}px`,
              height: `${e.size}px`,
              boxShadow: "0 0 8px 1px rgb(238 107 45 / 0.75)",
              "--dx": `${e.dx}px`,
              "--rise": `${e.rise}px`,
              "--dur": `${e.dur}s`,
              "--delay": `${e.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
