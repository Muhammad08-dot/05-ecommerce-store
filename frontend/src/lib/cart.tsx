'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { priceCart } from '@/lib/mock';
import type { CartLine, CartQuote } from '@/lib/types';

export interface CartItem {
  product_id: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  /** Server-validated lines + totals (authoritative pricing). */
  quote: CartQuote | null;
  count: number;
  loading: boolean;
  error: string | null;
  add: (product_id: number, qty?: number) => void;
  setQty: (product_id: number, qty: number) => void;
  remove: (product_id: number) => void;
  clear: () => void;
  refresh: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'halden.cart';

function readStored(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hydrate from localStorage on mount (avoids SSR/client mismatch).
  useEffect(() => {
    setItems(readStored());
  }, []);

  // Persist whenever items change.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Quote against the local mock — authoritative pricing, no network.
  useEffect(() => {
    if (items.length === 0) {
      setQuote(null);
      setError(null);
      return;
    }
    try {
      setQuote(priceCart(items));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not price your cart.');
    }
  }, [items]);

  const add = useCallback((product_id: number, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product_id === product_id);
      if (found) {
        return prev.map((i) =>
          i.product_id === product_id ? { ...i, qty: Math.min(99, i.qty + qty) } : i,
        );
      }
      return [...prev, { product_id, qty }];
    });
  }, []);

  const setQty = useCallback((product_id: number, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product_id !== product_id)
        : prev.map((i) => (i.product_id === product_id ? { ...i, qty: Math.min(99, qty) } : i)),
    );
  }, []);

  const remove = useCallback((product_id: number) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const refresh = useCallback(() => setItems((prev) => [...prev]), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  // Mock pricing is synchronous, so there is never a loading state.
  const loading = false;

  const value = useMemo(
    () => ({ items, quote, count, loading, error, add, setQty, remove, clear, refresh }),
    [items, quote, count, loading, error, add, setQty, remove, clear, refresh],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

export type { CartLine };
