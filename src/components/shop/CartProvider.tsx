"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { Product } from "@/content/types";
import { priceCart, type CartSummary } from "@/lib/cart/pricing";
import type { CartLine } from "@/lib/cart/types";
import { cartStore } from "./cart-store";

interface CartContextValue {
  lines: CartLine[];
  summary: CartSummary;
  /** false, solange der Browser-Speicher noch nicht gelesen wurde (verhindert „leer“-Flackern) */
  ready: boolean;
  /** false, wenn der Browser das Speichern blockiert */
  persistent: boolean;
  add: (product: Product, selection: Record<string, string>, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  /** Text für die Live-Region (Screenreader) */
  announcement: string;
}

const CartContext = createContext<CartContextValue | null>(null);

const subscribeNoop = () => () => {};

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const persistent = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getPersistentSnapshot,
    cartStore.getPersistentServerSnapshot,
  );
  const ready = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const summary = useMemo(() => priceCart(lines), [lines]);

  const add = useCallback((product: Product, selection: Record<string, string>, quantity = 1) => {
    cartStore.add(product, selection, quantity);
    setAnnouncement(`${product.name} wurde dem Warenkorb hinzugefügt.`);
    setDrawerOpen(true);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      summary,
      ready,
      persistent,
      add,
      setQuantity: (key, quantity) => cartStore.setQuantity(key, quantity),
      remove: (key) => {
        cartStore.remove(key);
        setAnnouncement("Position wurde aus dem Warenkorb entfernt.");
      },
      clear: () => {
        cartStore.clear();
        setAnnouncement("Der Warenkorb wurde geleert.");
      },
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      announcement,
    }),
    [lines, summary, ready, persistent, add, drawerOpen, announcement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart muss innerhalb des CartProvider verwendet werden.");
  return ctx;
}
