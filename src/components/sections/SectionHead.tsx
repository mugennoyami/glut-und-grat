import type { ReactNode } from "react";
import { Caps } from "@/components/ui/Caps";

export function SectionHead({
  eyebrow,
  title,
  lead,
  tone = "dark",
  id,
  as: Heading = "h2",
  className = "",
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  tone?: "dark" | "bone";
  id: string;
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={className}>
      <p className={`eyebrow ${tone === "bone" ? "text-copper-deep" : "text-copper"}`}>
        <Caps>{eyebrow}</Caps>
      </p>
      <Heading id={id} className="display mt-4 text-[clamp(2.4rem,5.6vw,4.4rem)]">
        {title}
      </Heading>
      {lead ? <p className={`prose-copy mt-5 text-lg ${tone === "bone" ? "text-ink-soft" : "text-bone/90"}`}>{lead}</p> : null}
      {children}
    </div>
  );
}
