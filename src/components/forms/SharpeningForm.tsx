"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { sharpeningBladeTypes, sharpeningConditions } from "@/content/forms";
import { inquiryToText } from "@/lib/inquiries/format";
import { fieldErrors, inquirySchema, parseDecimal } from "@/lib/inquiries/schemas";
import { ContactFields, emptyContact, type ContactValues } from "./ContactFields";
import { RadioGroupField, SelectField, TextAreaField, TextField } from "./fields";
import { DeliveryNotice, ErrorSummary, FormSection, SubmitFeedback } from "./FormParts";
import { useDeliveryConfigured, useInquirySubmit } from "./useInquirySubmit";

interface Values extends ContactValues {
  bladeType: string;
  bladeTypeOther: string;
  quantity: string;
  bladeLength: string;
  condition: string;
  wishes: string;
}

const initial: Values = {
  ...emptyContact,
  bladeType: "",
  bladeTypeOther: "",
  quantity: "1",
  bladeLength: "",
  condition: "",
  wishes: "",
};

function toPayload(v: Values) {
  const quantity = /^\d+$/.test(v.quantity.trim()) ? Number(v.quantity.trim()) : undefined;
  return {
    type: "sharpening",
    bladeType: v.bladeType || undefined,
    bladeTypeOther: v.bladeTypeOther,
    quantity,
    bladeLengthCm: parseDecimal(v.bladeLength),
    condition: v.condition || undefined,
    wishes: v.wishes,
    name: v.name,
    email: v.email,
    consent: v.consent,
    website: v.website,
  };
}

/** Strukturierte Schärfanfrage. Eingaben bleiben im Arbeitsspeicher; gesendet wird nur über /api/inquiries. */
export function SharpeningForm() {
  const [values, setValues] = useState<Values>(initial);
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

  const sentOk = status.state === "sent";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8" aria-describedby="sharpen-photo-note">
      <DeliveryNotice configured={configured} />
      <ErrorSummary errors={shown} focusKey={focusKey} />

      <FormSection title="Das Messer">
        <SelectField
          label="Klingentyp"
          name="bladeType"
          required
          options={sharpeningBladeTypes}
          value={values.bladeType}
          onChange={(e) => patch({ bladeType: e.target.value })}
          error={shown.bladeType}
        />
        {values.bladeType === "sonstiges" ? (
          <TextField
            label="Um welche Art von Messer handelt es sich?"
            name="bladeTypeOther"
            required
            value={values.bladeTypeOther}
            onChange={(e) => patch({ bladeTypeOther: e.target.value })}
            error={shown.bladeTypeOther}
          />
        ) : null}
        {values.bladeType === "schwert" ? (
          <p role="note" className="rounded-[3px] border border-copper/45 bg-copper/8 p-4 text-[0.9375rem]">
            Schwerter werden nur nach individueller Prüfung angenommen. Beschreibe Klinge und Zustand deshalb besonders genau. Mit der Anfrage ist noch keine
            Zusage verbunden.
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Anzahl"
            name="quantity"
            required
            inputMode="numeric"
            autoComplete="off"
            value={values.quantity}
            onChange={(e) => patch({ quantity: e.target.value })}
            error={shown.quantity}
          />
          <TextField
            label="Ungefähre Klingenlänge in cm"
            name="bladeLengthCm"
            required
            inputMode="decimal"
            autoComplete="off"
            placeholder="z. B. 20"
            hint="Bei mehreren Messern: das längste."
            value={values.bladeLength}
            onChange={(e) => patch({ bladeLength: e.target.value })}
            error={shown.bladeLengthCm}
          />
        </div>

        <RadioGroupField
          legend="Zustand der Schneide"
          name="condition"
          required
          options={sharpeningConditions}
          value={values.condition}
          onChange={(v) => patch({ condition: v })}
          error={shown.condition}
        />

        <TextAreaField
          label="Besondere Wünsche"
          name="wishes"
          hint="Optional: Schliffwinkel, Nutzung, Vorgeschichte, Fragen."
          value={values.wishes}
          onChange={(e) => patch({ wishes: e.target.value })}
          error={shown.wishes}
        />
        <p id="sharpen-photo-note" className="text-[0.8125rem] text-fog">
          Einen Foto-Upload gibt es hier noch nicht. Beschreib den Zustand bitte in Worten; Fotos kannst du bei Rückfragen nachreichen.
        </p>
      </FormSection>

      <ContactFields values={values} onChange={patch} errors={shown} />

      <div className="space-y-4">
        <Button type="submit" size="lg" disabled={status.state === "sending" || sentOk}>
          {status.state === "sending" ? "Wird gesendet …" : "Schärfanfrage absenden"}
        </Button>
        <SubmitFeedback
          status={status}
          copyText={lastText}
          onReset={() => {
            setValues(initial);
            reset();
          }}
        />
      </div>
    </form>
  );
}
