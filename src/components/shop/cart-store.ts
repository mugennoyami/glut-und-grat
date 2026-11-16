import { addLine, removeLine, sanitizeStoredLines, setLineQuantity } from "@/lib/cart/operations";
import type { Product } from "@/content/types";
import type { CartLine } from "@/lib/cart/types";

/**
 * Warenkorb-Speicher im Browser (localStorage, versionierter Schlüssel).
 * Gespeichert werden nur Produkt-ID, Optionsauswahl und Menge – nie Preise oder Kontaktdaten.
 * Fällt localStorage aus (z. B. privater Modus), bleibt der Warenkorb für die Sitzung im Arbeitsspeicher.
 */

export const CART_STORAGE_KEY = "glutgrat.cart.v1";

const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();

let current: CartLine[] | null = null;
let persistent = true;
let storageListening = false;

function emit(): void {
  for (const l of listeners) l();
}

function readFromStorage(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    persistent = true;
    return raw ? sanitizeStoredLines(JSON.parse(raw)) : [];
  } catch (error) {
    // JSON kaputt → leerer Warenkorb; Zugriff blockiert → nur Arbeitsspeicher
    if (error instanceof SyntaxError) return [];
    persistent = false;
    return [];
  }
}

function writeToStorage(lines: CartLine[]): void {
  try {
    if (lines.length === 0) window.localStorage.removeItem(CART_STORAGE_KEY);
    else window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    persistent = true;
  } catch {
    persistent = false;
  }
}

function onStorageEvent(event: StorageEvent): void {
  if (event.key !== CART_STORAGE_KEY && event.key !== null) return;
  current = readFromStorage();
  emit();
}

export const cartStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (!storageListening && typeof window !== "undefined") {
      window.addEventListener("storage", onStorageEvent);
      storageListening = true;
    }
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): CartLine[] {
    if (current === null) current = readFromStorage();
    return current;
  },
  getServerSnapshot(): CartLine[] {
    return EMPTY;
  },
  isPersistent(): boolean {
    return persistent;
  },
  getPersistentSnapshot(): boolean {
    return persistent;
  },
  getPersistentServerSnapshot(): boolean {
    return true;
  },
  set(next: CartLine[]): void {
    current = next;
    writeToStorage(next);
    emit();
  },
  add(product: Product, selection: Record<string, string>, quantity = 1): void {
    this.set(addLine(this.getSnapshot(), product, selection, quantity));
  },
  setQuantity(key: string, quantity: number): void {
    this.set(setLineQuantity(this.getSnapshot(), key, quantity));
  },
  remove(key: string): void {
    this.set(removeLine(this.getSnapshot(), key));
  },
  clear(): void {
    this.set([]);
  },
};
