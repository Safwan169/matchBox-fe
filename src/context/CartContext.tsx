"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

const STORAGE_KEY = "mb_cart";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number; // poisha, as last seen; the server re-prices at checkout
  stock: number;
  maxPerOrder?: number | null; // missing on carts saved before the limit existed
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  ready: boolean; // false until the cart has been read from storage
  count: number;
  subtotal: number;
  add(product: Product, quantity?: number): void;
  setQuantity(productId: string, quantity: number): void;
  remove(productId: string): void;
  replace(items: CartItem[]): void;
  clear(): void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Most of one product a single order may hold: its stock, capped by its per-order limit. */
export const orderLimit = (item: { stock: number; maxPerOrder?: number | null }) =>
  item.maxPerOrder ? Math.min(item.stock, item.maxPerOrder) : item.stock;

const clamp = (qty: number, max: number) => Math.max(1, Math.min(Math.floor(qty), max));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage after mount
      if (Array.isArray(saved)) setItems(saved);
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const add = useCallback((product: Product, quantity = 1) => {
    if (product.stock <= 0) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, stock: product.stock, maxPerOrder: product.maxPerOrder, price: product.price, quantity: clamp(i.quantity + quantity, orderLimit(product)) } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0] ?? null,
          price: product.price,
          stock: product.stock,
          maxPerOrder: product.maxPerOrder,
          quantity: clamp(quantity, orderLimit(product)),
        },
      ];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: clamp(quantity, orderLimit(i)) } : i)));
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const replace = useCallback((next: CartItem[]) => setItems(next), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    return { items, ready, count, subtotal, add, setQuantity, remove, replace, clear };
  }, [items, ready, add, setQuantity, remove, replace, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
