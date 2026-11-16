/**
 * Shop-weite Beispielkonfiguration (Demo).
 * Versandkosten und -länder sind Platzhalter und müssen vor der Live-Schaltung festgelegt werden.
 */
export const shopConfig = {
  currency: "EUR" as const,
  locale: "de-DE",
  shipping: {
    label: "Standardversand (Beispiel)",
    /** Pauschale in Cent */
    flatRateCents: 590,
    /** Versandkostenfrei ab Warenwert in Cent; undefined = keine Grenze */
    freeFromCents: undefined as number | undefined,
    countries: ["Deutschland"],
  },
};
