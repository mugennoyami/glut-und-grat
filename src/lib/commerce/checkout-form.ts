/** Eingaben der Demo-Kasse. Sie bleiben im Arbeitsspeicher des Browsers und werden nie gesendet. */
export interface CheckoutValues {
  name: string;
  email: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  understood: boolean;
}

export const emptyCheckoutValues: CheckoutValues = {
  name: "",
  email: "",
  street: "",
  zip: "",
  city: "",
  country: "Deutschland",
  understood: false,
};

/** Liefert Feldfehler (leer = alles gültig). */
export function validateCheckout(v: CheckoutValues): Record<string, string> {
  const e: Record<string, string> = {};
  if (v.name.trim().length < 2) e.name = "Bitte gib einen Namen an (Demo: gern ausgedacht).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Bitte gib eine gültige E-Mail-Adresse an.";
  if (v.street.trim().length < 3) e.street = "Bitte gib Straße und Hausnummer an.";
  if (!/^\d{5}$/.test(v.zip.trim())) e.zip = "Bitte gib eine fünfstellige Postleitzahl an.";
  if (v.city.trim().length < 2) e.city = "Bitte gib einen Ort an.";
  if (!v.country) e.country = "Bitte wähle ein Land.";
  if (!v.understood) e.understood = "Bitte bestätige, dass dies nur ein Demo-Durchlauf ist.";
  return e;
}
