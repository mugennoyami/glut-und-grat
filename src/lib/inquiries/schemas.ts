import { z } from "zod";
import {
  customBaseProducts,
  customBudgets,
  customMaterials,
  customScopes,
  customStyles,
  FORM_LIMITS,
  sharpeningBladeTypes,
  sharpeningConditions,
} from "@/content/forms";

/**
 * Gemeinsame Validierung für Browser und Server.
 * Der Server validiert jede Anfrage erneut – Browser-Prüfungen sind nur Komfort.
 */

function values<T extends readonly { value: string }[]>(list: T) {
  return list.map((c) => c.value) as unknown as [T[number]["value"], ...T[number]["value"][]];
}

const consent = z.literal(true, { error: "Bitte bestätige den Hinweis zur Verarbeitung deiner Angaben." });

const contactFields = {
  name: z
    .string({ error: "Bitte gib deinen Namen an." })
    .trim()
    .min(2, "Bitte gib deinen Namen an.")
    .max(FORM_LIMITS.nameMax, `Der Name darf höchstens ${FORM_LIMITS.nameMax} Zeichen haben.`),
  email: z
    .string({ error: "Bitte gib deine E-Mail-Adresse an." })
    .trim()
    .min(1, "Bitte gib deine E-Mail-Adresse an.")
    .max(FORM_LIMITS.emailMax, "Die E-Mail-Adresse ist zu lang.")
    .pipe(z.email("Bitte gib eine gültige E-Mail-Adresse an, z. B. name@beispiel.de.")),
  consent,
  /** Honeypot: echte Nutzer lassen das Feld leer; die API verwirft Anfragen mit Inhalt. */
  website: z.string().max(500).optional(),
};

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Bitte höchstens ${max} Zeichen.`)
    .optional()
    .transform((v) => (v ? v : undefined));

export const sharpeningSchema = z
  .object({
    type: z.literal("sharpening"),
    bladeType: z.enum(values(sharpeningBladeTypes), { error: "Bitte wähle einen Klingentyp." }),
    bladeTypeOther: optionalText(FORM_LIMITS.shortTextMax),
    quantity: z
      .number({ error: "Bitte gib die Anzahl als Zahl an." })
      .int("Bitte gib eine ganze Zahl an.")
      .min(1, "Mindestens ein Messer.")
      .max(FORM_LIMITS.quantityMax, `Bitte höchstens ${FORM_LIMITS.quantityMax} Messer pro Anfrage.`),
    bladeLengthCm: z
      .number({ error: "Bitte gib die ungefähre Klingenlänge in Zentimetern an." })
      .min(FORM_LIMITS.bladeLengthMinCm, `Die Länge muss mindestens ${FORM_LIMITS.bladeLengthMinCm} cm betragen.`)
      .max(FORM_LIMITS.bladeLengthMaxCm, `Die Länge darf höchstens ${FORM_LIMITS.bladeLengthMaxCm} cm betragen.`),
    condition: z.enum(values(sharpeningConditions), { error: "Bitte beschreibe den Zustand." }),
    wishes: optionalText(FORM_LIMITS.wishesMax),
    ...contactFields,
  })
  .superRefine((val, ctx) => {
    if (val.bladeType === "sonstiges" && !val.bladeTypeOther) {
      ctx.addIssue({
        code: "custom",
        path: ["bladeTypeOther"],
        message: "Bitte beschreibe kurz, um welche Art von Messer es sich handelt.",
      });
    }
  });

export const customWorkSchema = z.object({
  type: z.literal("custom"),
  baseProduct: z.enum(values(customBaseProducts), { error: "Bitte wähle ein Ausgangsprodukt." }),
  scope: z
    .array(z.enum(values(customScopes)))
    .min(1, "Bitte wähle Griff, Scheide oder Ausrüstung / Sortimentswunsch."),
  materials: z
    .array(z.enum(values(customMaterials)))
    .min(1, "Bitte wähle mindestens ein Material oder „Beratung gewünscht“."),
  style: z.enum(values(customStyles), { error: "Bitte wähle einen Stil." }),
  budget: z.enum(values(customBudgets), { error: "Bitte wähle einen Budgetrahmen." }),
  description: z
    .string({ error: "Bitte beschreibe dein Projekt." })
    .trim()
    .min(FORM_LIMITS.descriptionMin, `Bitte beschreibe dein Projekt in mindestens ${FORM_LIMITS.descriptionMin} Zeichen.`)
    .max(FORM_LIMITS.longTextMax, `Bitte höchstens ${FORM_LIMITS.longTextMax} Zeichen.`),
  ...contactFields,
});

export const contactSchema = z.object({
  type: z.literal("contact"),
  message: z
    .string({ error: "Bitte schreib uns, worum es geht." })
    .trim()
    .min(FORM_LIMITS.messageMin, `Bitte schreib mindestens ${FORM_LIMITS.messageMin} Zeichen.`)
    .max(FORM_LIMITS.longTextMax, `Bitte höchstens ${FORM_LIMITS.longTextMax} Zeichen.`),
  ...contactFields,
});

export const inquirySchema = z.discriminatedUnion("type", [sharpeningSchema, customWorkSchema, contactSchema]);

export type SharpeningInquiry = z.infer<typeof sharpeningSchema>;
export type CustomWorkInquiry = z.infer<typeof customWorkSchema>;
export type ContactInquiry = z.infer<typeof contactSchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryType = Inquiry["type"];

/** Feldfehler als flache Map: "feld" → erste Meldung. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? String(issue.path[0]) : "_form";
    if (!(key in result)) result[key] = issue.message;
  }
  return result;
}

/** Wandelt "12,5" oder "12.5" in eine Zahl; leere/ungültige Eingaben ergeben undefined. */
export function parseDecimal(input: string): number | undefined {
  const trimmed = input.trim().replace(",", ".");
  if (trimmed === "") return undefined;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return undefined;
  return Number(trimmed);
}
