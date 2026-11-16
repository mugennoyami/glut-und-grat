"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CloseIcon } from "./icons";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Seite, von der der Dialog hereingleitet */
  side?: "right" | "left";
  id?: string;
  width?: string;
  /** Kopfzeile rechts vom Titel (z. B. Anzahl) */
  headerExtra?: ReactNode;
}

/**
 * Seitlicher Dialog auf Basis des nativen <dialog>-Elements:
 * Fokus wird eingefangen und danach zurückgegeben, Esc schließt, der Hintergrund ist inaktiv.
 */
export function SideDialog({ open, onClose, title, children, side = "right", id, width = "min(30rem, 100vw)", headerExtra }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Bei Seitenwechsel schließen
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const titleId = `${id ?? "dialog"}-title`;
  const anchor = side === "right" ? "ml-auto" : "mr-auto";

  return (
    <dialog
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`side-dialog fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-bone ${side === "right" ? "side-right" : "side-left"}`}
    >
      <div
        className={`${anchor} flex h-dvh flex-col border-bone/10 bg-forge shadow-2xl ${side === "right" ? "border-l" : "border-r"}`}
        style={{ width }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-bone/10 px-5 py-4">
          <h2 id={titleId} className="font-display text-2xl font-semibold">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {headerExtra}
            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 place-items-center rounded-[3px] text-bone hover:text-copper"
              aria-label={`${title} schließen`}
            >
              <CloseIcon size={22} />
            </button>
          </div>
        </div>
        {children}
      </div>
    </dialog>
  );
}
