/** Platzhalter für echte Fotos. Es werden bewusst keine Werkstattfotos vorgetäuscht. */
export function PhotoSlot({ label, aspect = "3/2", className = "" }: { label: string; aspect?: string; className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-[3px] border border-dashed border-bone/30 bg-anthracite/40 p-6 text-center ${className}`}
      style={{ aspectRatio: aspect }}
      role="img"
      aria-label={`Platzhalter: ${label}`}
    >
      <div>
        <p className="font-display text-xl font-semibold">{label}</p>
        <p className="mx-auto mt-2 max-w-[18rem] text-sm text-fog">Echte Aufnahmen folgen. Bis dahin bleibt dieser Platz bewusst leer.</p>
      </div>
    </div>
  );
}
