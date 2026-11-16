import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Tone = "dark" | "bone";
type Size = "md" | "lg";

interface StyleOptions {
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  full?: boolean;
}

/** Gemeinsame Button-Optik: mindestens 44 px hoch, klarer Fokusring, keine Gradient-Effekte. */
export function buttonClass({ variant = "primary", tone = "dark", size = "md", full = false }: StyleOptions = {}): string {
  const base =
    "inline-flex select-none items-center justify-center gap-2.5 rounded-[3px] font-semibold tracking-[0.01em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45";
  const sizes = size === "lg" ? "min-h-14 px-7 text-[1.0625rem]" : "min-h-12 px-5 text-base";
  const width = full ? "w-full" : "";

  const palette: Record<Tone, Record<Variant, string>> = {
    dark: {
      primary: "bg-copper text-coal hover:bg-ember-soft active:bg-ember",
      secondary: "border border-bone/35 text-bone hover:border-copper hover:text-copper",
      ghost: "text-bone hover:text-copper",
    },
    bone: {
      primary: "bg-ink text-bone hover:bg-copper-deep active:bg-copper-deep",
      secondary: "border border-ink/45 text-ink hover:border-copper-deep hover:text-copper-deep",
      ghost: "text-ink hover:text-copper-deep",
    },
  };
  return [base, sizes, width, palette[tone][variant]].filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & StyleOptions;

export function Button({ variant, tone, size, full, className = "", type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={`${buttonClass({ variant, tone, size, full })} ${className}`} {...rest} />;
}

type LinkProps = ComponentProps<typeof Link> & StyleOptions;

export function ButtonLink({ variant, tone, size, full, className = "", ...rest }: LinkProps) {
  return <Link className={`${buttonClass({ variant, tone, size, full })} ${className}`} {...rest} />;
}
