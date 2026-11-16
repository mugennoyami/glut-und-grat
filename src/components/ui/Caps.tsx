import { Fragment } from "react";

/**
 * Für Versal-Beschriftungen (text-transform: uppercase): CSS macht aus „ß“ ein „SS“ – aus „Maßarbeit“
 * würde „MASSARBEIT“. Das „ß“ bleibt hier deshalb unverändert stehen („MAßARBEIT“).
 */
export function Caps({ children }: { children: string }) {
  const parts = children.split("ß");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 ? <span className="normal-case">ß</span> : null}
          {part}
        </Fragment>
      ))}
    </>
  );
}
