"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { MenuItem, formatBRL } from "@/lib/menu";

interface CartLine {
  item: MenuItem;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  count: number;
  total: number;
  add: (item: MenuItem) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  whatsappUrl: (phone: string) => string;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, CartLine>>({});

  const add = useCallback((item: MenuItem) => {
    setMap((m) => {
      const existing = m[item.id];
      return {
        ...m,
        [item.id]: { item, qty: existing ? existing.qty + 1 : 1 },
      };
    });
  }, []);

  const inc = useCallback((id: string) => {
    setMap((m) => (m[id] ? { ...m, [id]: { ...m[id], qty: m[id].qty + 1 } } : m));
  }, []);

  const dec = useCallback((id: string) => {
    setMap((m) => {
      const line = m[id];
      if (!line) return m;
      if (line.qty <= 1) {
        const { [id]: _, ...rest } = m;
        return rest;
      }
      return { ...m, [id]: { ...line, qty: line.qty - 1 } };
    });
  }, []);

  const remove = useCallback((id: string) => {
    setMap((m) => {
      const { [id]: _, ...rest } = m;
      return rest;
    });
  }, []);

  const clear = useCallback(() => setMap({}), []);

  const lines = useMemo(() => Object.values(map), [map]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const total = useMemo(
    () => lines.reduce((s, l) => s + l.qty * l.item.price, 0),
    [lines],
  );

  const whatsappUrl = useCallback(
    (phone: string) => {
      const header = "*Pedido — Feron Burger* 🍔\n\n";
      const body = lines
        .map(
          (l) =>
            `• ${l.qty}x ${l.item.name} — ${formatBRL(l.qty * l.item.price)}`,
        )
        .join("\n");
      const footer = `\n\n*Total: ${formatBRL(total)}*`;
      const text = encodeURIComponent(header + body + footer);
      return `https://wa.me/${phone}?text=${text}`;
    },
    [lines, total],
  );

  const value: CartState = {
    lines,
    count,
    total,
    add,
    inc,
    dec,
    remove,
    clear,
    whatsappUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
