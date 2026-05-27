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
  id: string;
  item: MenuItem;
  qty: number;
  choices?: string[];
}

interface CartState {
  lines: CartLine[];
  count: number;
  total: number;
  add: (item: MenuItem, choices?: string[]) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  whatsappUrl: (phone: string) => string;
}

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Record<string, CartLine>>({});

  const add = useCallback((item: MenuItem, choices?: string[]) => {
    // Gera uma chave única baseada no item e nas escolhas (ex: combo-casal-feronburger-coca)
    const choicesKey = choices && choices.length > 0 
      ? "-" + choices.map((c) => c.toLowerCase().replace(/[^a-z0-9]/g, "")).sort().join("-")
      : "";
    const lineId = `${item.id}${choicesKey}`;

    setMap((m) => {
      const existing = m[lineId];
      return {
        ...m,
        [lineId]: { id: lineId, item, qty: existing ? existing.qty + 1 : 1, choices },
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
        .map((l) => {
          const choicesStr = l.choices && l.choices.length > 0
            ? `\n   └ _Opções: ${l.choices.join(" + ")}_`
            : "";
          return `• ${l.qty}x *${l.item.name}* — ${formatBRL(l.qty * l.item.price)}${choicesStr}`;
        })
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
