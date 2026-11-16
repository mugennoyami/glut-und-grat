"use client";

import Link from "next/link";
import { ConsentField, HoneypotField, TextField } from "./fields";
import { FormSection } from "./FormParts";

export interface ContactValues {
  name: string;
  email: string;
  consent: boolean;
  website: string;
}

export const emptyContact: ContactValues = { name: "", email: "", consent: false, website: "" };

/** Gemeinsamer Kontaktblock für alle Anfrageformulare. */
export function ContactFields({
  values,
  onChange,
  errors,
}: {
  values: ContactValues;
  onChange: (patch: Partial<ContactValues>) => void;
  errors: Record<string, string>;
}) {
  return (
    <FormSection title="Dein Kontakt">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Name"
          name="name"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => onChange({ name: e.target.value })}
          error={errors.name}
        />
        <TextField
          label="E-Mail-Adresse"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={values.email}
          onChange={(e) => onChange({ email: e.target.value })}
          error={errors.email}
        />
      </div>
      <ConsentField name="consent" checked={values.consent} onChange={(v) => onChange({ consent: v })} error={errors.consent}>
        Ich bin damit einverstanden, dass meine Angaben zur Bearbeitung dieser Anfrage verwendet werden. Mehr dazu in den{" "}
        <Link href="/datenschutz" className="underline underline-offset-4 hover:text-copper">
          Datenschutzhinweisen
        </Link>{" "}
        (Platzhalter).
      </ConsentField>
      <HoneypotField value={values.website} onChange={(v) => onChange({ website: v })} />
    </FormSection>
  );
}
