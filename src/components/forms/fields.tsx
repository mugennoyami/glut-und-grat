"use client";

import { useId, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { AlertIcon } from "@/components/ui/icons";

/**
 * Formularbausteine: jedes Feld hat ein sichtbares Label, optionalen Hinweis und eine Fehlermeldung,
 * die per aria-describedby verknüpft ist. Pflichtfelder sind mit * und aria-required markiert.
 */

const control =
  "w-full rounded-[3px] border bg-coal px-4 text-base text-bone placeholder:text-smoke transition-colors focus-visible:border-copper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-soft";

function borderFor(error?: string) {
  return error ? "border-ember" : "border-bone/30 hover:border-bone/50";
}

interface BaseProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  className = "",
  children,
}: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.9375rem] font-medium">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-copper">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-0.5 mb-2 text-[0.8125rem] text-fog">
          {hint}
        </p>
      ) : null}
      {children}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function FieldError({ id, message }: { id: string; message: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[0.875rem] font-medium text-ember-soft">
      <AlertIcon size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length ? ids.join(" ") : undefined;
}

type TextProps = BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> & { name: string };

export function TextField({ label, hint, error, required, className, name, ...rest }: TextProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <input
        id={id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        data-field={name}
        className={`${control} min-h-12 ${borderFor(error)}`}
        {...rest}
      />
    </FieldShell>
  );
}

type AreaProps = BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "id"> & { name: string };

export function TextAreaField({ label, hint, error, required, className, name, rows = 5, ...rest }: AreaProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        data-field={name}
        className={`${control} min-h-32 resize-y py-3 leading-relaxed ${borderFor(error)}`}
        {...rest}
      />
    </FieldShell>
  );
}

interface Choice {
  value: string;
  label: string;
  hint?: string;
}

type SelectProps = BaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "className" | "id"> & {
    name: string;
    options: readonly Choice[];
    placeholder?: string;
  };

export function SelectField({ label, hint, error, required, className, name, options, placeholder = "Bitte wählen", ...rest }: SelectProps) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required} className={className}>
      <select
        id={id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        data-field={name}
        className={`${control} min-h-12 appearance-none bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11 ${borderFor(error)}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c6844c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {o.hint ? ` – ${o.hint}` : ""}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface ChoiceGroupProps {
  legend: string;
  name: string;
  options: readonly Choice[];
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

/** Einzelauswahl als Radiogruppe (Karten mit 44 px Zielfläche). */
export function RadioGroupField({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  hint,
  required,
  className = "",
}: ChoiceGroupProps & { value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <fieldset
      role="radiogroup"
      className={`min-w-0 ${className}`}
      aria-describedby={describedBy(id, hint, error)}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      data-field={name}
    >
      <legend className="mb-1.5 text-[0.9375rem] font-medium">
        {legend}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-copper">
              *
            </span>
            <span className="sr-only"> (Pflichtfeld)</span>
          </>
        ) : null}
      </legend>
      {hint ? (
        <p id={`${id}-hint`} className="mb-2 text-[0.8125rem] text-fog">
          {hint}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.value} className="relative block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span className="flex min-h-12 items-center gap-3 rounded-[3px] border border-bone/30 px-3.5 py-2.5 text-[0.9375rem] transition-colors peer-checked:border-copper peer-checked:bg-copper/12 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember-soft hover:border-bone/55">
              <span className="grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-full border border-bone/50 peer-checked:border-copper" aria-hidden="true">
                <span className={`h-2.5 w-2.5 rounded-full bg-copper transition-opacity ${value === o.value ? "opacity-100" : "opacity-0"}`} />
              </span>
              <span>
                {o.label}
                {o.hint ? <span className="block text-[0.8125rem] text-fog">{o.hint}</span> : null}
              </span>
            </span>
          </label>
        ))}
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </fieldset>
  );
}

/** Mehrfachauswahl als Checkbox-Gruppe. */
export function CheckboxGroupField({
  legend,
  name,
  options,
  values,
  onChange,
  error,
  hint,
  required,
  className = "",
}: ChoiceGroupProps & { values: string[]; onChange: (v: string[]) => void }) {
  const id = useId();
  const toggle = (v: string) => onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);
  return (
    <fieldset className={`min-w-0 ${className}`} aria-describedby={describedBy(id, hint, error)} data-field={name}>
      <legend className="mb-1.5 text-[0.9375rem] font-medium">
        {legend}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-copper">
              *
            </span>
            <span className="sr-only"> (Pflichtfeld)</span>
          </>
        ) : null}
      </legend>
      {hint ? (
        <p id={`${id}-hint`} className="mb-2 text-[0.8125rem] text-fog">
          {hint}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const checked = values.includes(o.value);
          return (
            <label key={o.value} className="relative block cursor-pointer">
              <input type="checkbox" name={name} value={o.value} checked={checked} onChange={() => toggle(o.value)} className="peer sr-only" />
              <span className="flex min-h-12 items-center gap-3 rounded-[3px] border border-bone/30 px-3.5 py-2.5 text-[0.9375rem] transition-colors peer-checked:border-copper peer-checked:bg-copper/12 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember-soft hover:border-bone/55">
                <span
                  className={`grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-[2px] border ${checked ? "border-copper bg-copper text-coal" : "border-bone/50"}`}
                  aria-hidden="true"
                >
                  {checked ? (
                    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 8.5 3.2 3.2L13 4.8" />
                    </svg>
                  ) : null}
                </span>
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </fieldset>
  );
}

/** Einzelne Checkbox (z. B. Einwilligung). */
export function ConsentField({
  name,
  checked,
  onChange,
  error,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <label className="relative flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-required="true"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          data-field={name}
          className="peer sr-only"
        />
        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[2px] border transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ember-soft ${
            checked ? "border-copper bg-copper text-coal" : error ? "border-ember" : "border-bone/50"
          }`}
          aria-hidden="true"
        >
          {checked ? (
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 8.5 3.2 3.2L13 4.8" />
            </svg>
          ) : null}
        </span>
        <span className="text-[0.9375rem] leading-snug">{children}</span>
      </label>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

/** Honeypot: für Menschen unsichtbar und nicht per Tab erreichbar. */
export function HoneypotField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website (bitte leer lassen)
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
