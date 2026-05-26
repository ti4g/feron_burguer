"use client";

import { useState } from "react";
import {
  CATEGORIES,
  MENU,
  Category,
  MenuItem,
  formatBRL,
  highlightFlavors,
} from "@/lib/menu";
import { useCart } from "@/components/cart/CartProvider";

export default function Menu() {
  const [active, setActive] = useState<Category>("burgers");
  const items = MENU.filter((i) => i.category === active);

  return (
    <section id="cardapio" className="relative z-10 bg-void px-5 pb-32 pt-16">
      {/* Bridge / header */}
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-amber-brand">
          O Cardápio
        </p>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-white/90 sm:text-5xl">
          Agora escolha o seu
        </h2>
        <p className="mt-3 text-sm text-white/50">
          Toque em adicionar e finalize o pedido pelo WhatsApp.
        </p>
      </div>

      {/* Sticky category nav */}
      <div className="sticky top-0 z-20 -mx-5 mb-8 border-b border-white/5 bg-void/90 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === c.id
                  ? "bg-amber-brand text-black"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function Card({ item }: { item: MenuItem }) {
  const { add } = useCart();
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition hover:border-white/10 hover:bg-white/[0.05]">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-white/90">{item.name}</h3>
          <span className="shrink-0 font-bold text-amber-brand">
            {formatBRL(item.price)}
          </span>
        </div>
        {item.desc && (
          <p className="mt-2 text-sm leading-relaxed text-white/55">
            {highlightFlavors(item.desc).map((part, i) =>
              part.flavor ? (
                <span key={i} className="flavor">
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
        )}
      </div>
      <button
        onClick={() => add(item)}
        className="mt-4 self-start rounded-full bg-amber-brand/15 px-4 py-2 text-sm font-semibold text-amber-brand transition hover:bg-amber-brand hover:text-black"
      >
        + Adicionar
      </button>
    </div>
  );
}
