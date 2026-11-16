"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { inquiryToText } from "@/lib/inquiries/format";
import { fieldErrors, inquirySchema } from "@/lib/inquiries/schemas";
import { ContactFields, emptyContact, type ContactValues } from "./ContactFields";
import { TextAreaField } from "./fields";
import { DeliveryNotice, ErrorSummary, FormSection, SubmitFeedback } from "./FormParts";
import { useDeliveryConfigured, useInquirySubmit } from "./useInquirySubmit";

interface Values extends ContactValues {
  message: string;
}

const blank: Values = { ...emptyContact, message: "" };

/** Allgemeine Frage an die Werkstatt. */
export function ContactForm() {
  const [values, setValues] = useState<Values>(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusKey, setFocusKey] = useState(0);
  const configured = useDeliveryConfigured();
  const { status, serverErrors, submit, reset } = useInquirySubmit();
  const [lastText, setLastText] = useState("");

  const patch = (p: Partial<Values>) => setValues((v) => ({ ...v, ...p }));
  const shown = { ...serverErrors, ...errors };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { type: "contact", message: values.message, name: values.name, email: values.email, consent: values.consent, website: values.website };
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
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <DeliveryNotice configured={configured} />
      <ErrorSummary errors={shown} focusKey={focusKey} />

      <FormSection title="Deine Frage">
        <TextAreaField
          label="Nachricht"
          name="message"
          required
          rows={6}
          value={values.message}
          onChange={(e) => patch({ message: e.target.value })}
          error={shown.message}
        />
      </FormSection>

      <ContactFields values={values} onChange={patch} errors={shown} />

      <div className="space-y-4">
        <Button type="submit" size="lg" disabled={status.state === "sending" || status.state === "sent"}>
          {status.state === "sending" ? "Wird gesendet …" : "Nachricht absenden"}
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
