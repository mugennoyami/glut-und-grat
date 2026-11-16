"use client";

import { useEffect } from "react";

/** Setzt `data-hydrated` am <html>-Element, sobald React die Seite übernommen hat (für stabile E2E-Tests). */
export function HydrationMarker() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true";
  }, []);
  return null;
}
