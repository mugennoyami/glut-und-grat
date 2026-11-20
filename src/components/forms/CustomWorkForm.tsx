"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { collections } from "@/content/collections";
import { customBaseProducts, customBudgets, customMaterials, customScopes, customStyles } from "@/content/forms";
import { inquiryToText } from "@/lib/inquiries/format";
import { fieldErrors, inquirySchema } from "@/lib/inquiries/schemas";
import { ContactFields, emptyContact, type ContactValues } from "./ContactFields";
import { CheckboxGroupField, RadioGroupField, SelectField, TextAreaField } from "./fields";
import { DeliveryNotice, ErrorSummary, FormSection, SubmitFeedback } from "./FormParts";
import { useDeliveryConfigured, useInquirySubmit } from "./useInquirySubmit";

interface Values extends ContactValues {
  baseProduct: string;
  scope: string[];
  materials: string[];
  style: string;
  budget: string;
  description: string;
}

const blank: Values = {
  ...emptyContact,
  baseProduct: "",
  scope: [],
  materials: [],
  style: "",
  budget: "",
  description: "",
};

function toPayload(v: Values) {
  return {
    type: "custom",
    baseProduct: v.baseProduct || undefined,
    scope: v.scope,
    materials: v.materials,
    style: v.style || undefined,
    budget: v.budget || undefined,
    description: v.description,
    name: v.name,
    email: v.email,
    consent: v.consent,
    website: v.website,
  };
}

/** Projektanfrage für Maßarbeit und die geplanten Kollektionen. */
export function CustomWorkForm() {
  const params = useSearchParams();
  const preset = params.get("produkt") ?? "";
  const presetValid = customBaseProducts.some((p) => p.value === preset) ? preset : "";

  const [values, setValues] = useState<Values>({ ...blank, baseProduct: presetValid, scope: collections.some(c => c.slug === presetValid) ? ["ausruestung"] : [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusKey, setFocusKey] = useState(0);
  const configured = useDeliveryConfigured();
  const { status, serverErrors, submit, reset } = useInquirySubmit();
  const [lastText, setLastText] = useState("");

  const patch = (p: Partial<Values>) => setValues((v) => ({ ...v, ...p }));
  const shown = { ...serverErrors, ...errors };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = toPayload(values);
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setFocusKey((k) => k + 1);
      return;
    }
    setErrors({});
    const { consent, website, ...data } = parsed.data;
    void consent;
    void website;
    setLastText(inquiryToText(data));
    await submit(payload);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby="custom-photo-note">
      <DeliveryNotice configured={configured} />
      <ErrorSummary errors={shown} focusKey={focusKey} />

      <FormSection title="Das Projekt">
        <SelectField
          label="Ausgangsprodukt"
          name="baseProduct"
          required
          options={customBaseProducts}
          value={values.baseProduct}
          onChange={(e) => patch({ baseProduct: e.target.value })}
          error={shown.baseProduct}
        />
        <CheckboxGroupField
          legend="Was soll gestaltet werden?"
          name="scope"
          required
          options={customScopes}
          values={values.scope}
          onChange={(v) => patch({ scope: v })}
          error={shown.scope}
        />
        <CheckboxGroupField
          legend="Materialwunsch"
          name="materials"
          required
          hint="Mehrere Angaben sind möglich. Ob ein Material verfügbar ist, hängt vom Projekt ab."
          options={customMaterials}
          values={values.materials}
          onChange={(v) => patch({ materials: v })}
          error={shown.materials}
        />
        <RadioGroupField
          legend="Stil"
          name="style"
          required
          options={customStyles}
          value={values.style}
          onChange={(v) => patch({ style: v })}
          error={shown.style}
        />
        <SelectField
          label="Budgetrahmen"
          name="budget"
          required
          hint="Dein Rahmen für das Projekt – kein Angebot und keine Zusage."
          options={customBudgets}
          value={values.budget}
          onChange={(e) => patch({ budget: e.target.value })}
          error={shown.budget}
        />
        <TextAreaField
          label="Beschreibung"
          name="description"
          required
          rows={7}
          hint="Für welchen Charakter, Markt oder Einsatzzweck ist dein Projekt? Geht es um Darstellung, LARP, Sammlung oder ein Schneidwerkzeug? Welche Maße, Vorbilder und Farben sind dir wichtig?"
          value={values.description}
          onChange={(e) => patch({ description: e.target.value })}
          error={shown.description}
        />
        <p id="custom-photo-note" className="text-[0.8125rem] text-fog">
          Einen Foto-Upload gibt es hier noch nicht. Beschreib deine Ausrüstung oder deine Vorstellung in Worten; Bilder kannst du bei Rückfragen nachreichen.
        </p>
      </FormSection>

      <ContactFields values={values} onChange={patch} errors={shown} />

      <div className="space-y-4">
        <Button type="submit" size="lg" disabled={status.state === "sending" || status.state === "sent"}>
          {status.state === "sending" ? "Wird gesendet …" : "Projekt anfragen"}
        </Button>
        <SubmitFeedback
          status={status}
          copyText={lastText}
          onReset={() => {
            setValues(blank);
            reset();
          }}
        />
      </div>
    </form>
  );
}
