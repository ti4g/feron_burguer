"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CATEGORIES,
  MENU,
  Category,
  MenuItem,
  formatBRL,
  highlightFlavors,
} from "@/lib/menu";
import { useCart } from "@/components/cart/CartProvider";

const BURGER_OPTIONS = [
  { id: "Feron Burger", desc: "Brioche, defumado 160g, cheddar, bacon, cebola caramelizada e molho especial." },
  { id: "Tradicional Burger", desc: "Brioche, defumado 160g, cheddar, alface, tomate e molho especial." },
  { id: "Tropical Burger", desc: "Brioche, defumado 160g, cheddar, bacon, abacaxi, alface e molho especial." },
  { id: "Banana Burger", desc: "Brioche, defumado 160g, cheddar, bacon, banana da terra, cebola roxa ao mel e molho." },
  { id: "Mumu Burger", desc: "Brioche, provolone derretido, bacon em cubos e doce de leite defumado." },
];

const SODA_LATA_OPTIONS = [
  "Coca-Cola Lata", "Coca Zero Lata", "Guaraná Lata",
  "Guaraná Zero Lata", "Sprite Lata", "Schweppes Lata",
];

const SODA_1L_OPTIONS = ["Coca-Cola 1L", "Coca Zero 1L", "Guaraná 1L"];

const WHATSAPP = "5563999614831";

const CAT_ICON: Record<Category, string> = {
  combos: "🎁", burgers: "🍔", porcoes: "🍟", bebidas: "🥤", adicionais: "+"
};

const CAT_LABEL: Record<Category, string> = {
  combos: "Combos", burgers: "Burgers", porcoes: "Porções",
  bebidas: "Bebidas", adicionais: "Adicionais",
};

export default function MainApp() {
  const [activeTab, setActiveTab] = useState<"home" | "menu" | "cart">("home");
  const [selectedCategory, setSelectedCategory] = useState<Category>("combos");
  const { lines, count, total, inc, dec, remove, clear, whatsappUrl, add } = useCart();
  const [customizingCombo, setCustomizingCombo] = useState<MenuItem | null>(null);
  const [comboBurgers, setComboBurgers] = useState<string[]>([]);
  const [comboSoda, setComboSoda] = useState<string>("");

  const startCustomizing = (item: MenuItem) => {
    setCustomizingCombo(item);
    const slots = item.id === "combo-individual" ? 1 : item.id === "combo-casal" ? 2 : 4;
    setComboBurgers(new Array(slots).fill(""));
    setComboSoda(item.id === "combo-familia" ? "Guaraná 1.5L" : "");
  };

  const popularItems = useMemo(() =>
    MENU.filter((i) => ["feron", "giga", "mumu", "batata-flamb-g"].includes(i.id)),
  []);

  const menuItems = useMemo(() =>
    MENU.filter((i) => i.category === selectedCategory),
  [selectedCategory]);

  return (
    <div
      id="app-interface"
      className="relative z-10 bg-void min-h-screen max-w-md mx-auto border-x border-white/[0.04] shadow-2xl"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-[45%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-amber-brand/[0.035] blur-[90px]" />

      <div className="px-4 pb-28 pt-10">

        {/* ── HEADER ── */}
        <header className="flex items-center justify-between mb-8">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div key="h-home" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                <p className="font-display text-[9px] font-semibold uppercase tracking-[0.38em] text-amber-brand">Bem-vindo à</p>
                <h1 className="font-display text-[26px] font-bold text-white leading-tight mt-0.5">
                  FERON <span className="text-amber-brand">BURGER</span>
                </h1>
              </motion.div>
            )}
            {activeTab === "menu" && (
              <motion.div key="h-menu" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                <p className="font-display text-[9px] font-semibold uppercase tracking-[0.38em] text-amber-brand">Cardápio</p>
                <h1 className="font-display text-[26px] font-bold text-white leading-tight mt-0.5">Escolha o seu</h1>
              </motion.div>
            )}
            {activeTab === "cart" && (
              <motion.div key="h-cart" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                <p className="font-display text-[9px] font-semibold uppercase tracking-[0.38em] text-amber-brand">Sua Sacola</p>
                <h1 className="font-display text-[26px] font-bold text-white leading-tight mt-0.5">
                  {count > 0 ? `${count} ${count === 1 ? "item" : "itens"}` : "Finalizar Pedido"}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setActiveTab("cart")}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.025] border border-white/[0.06] text-white/70 hover:bg-white/[0.06] hover:text-white transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-brand text-[10px] font-black text-black shadow-md shadow-amber-brand/40">
                {count}
              </span>
            )}
          </button>
        </header>

        {/* ══════════════════════════════════════
            HOME TAB
        ══════════════════════════════════════ */}
        {activeTab === "home" && (
          <div className="space-y-7">

            {/* HERO — Feron Burger destaque */}
            <div
              onClick={() => { setSelectedCategory("burgers"); setActiveTab("menu"); }}
              className="relative rounded-3xl overflow-hidden cursor-pointer group h-56"
              style={{ background: "linear-gradient(135deg, #110900 0%, #0e0600 50%, #120a02 100%)" }}
            >
              {/* Amber left stripe */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-brand via-amber-deep to-transparent z-10" />

              {/* Subtle grid texture */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
              />

              {/* Logo watermark */}
              <img
                src="/logo-feron.png"
                alt=""
                className="absolute right-4 top-1/2 -translate-y-1/2 w-36 h-36 opacity-10 group-hover:opacity-[0.15] transition-all duration-500 group-hover:scale-105"
              />

              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-5 left-6 right-6 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-amber-brand text-black font-display text-[8px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                    + Pedido
                  </span>
                  <span className="text-[9px] text-white/30 uppercase tracking-widest font-display">O favorito</span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white leading-tight">Feron Burger</h2>
                <p className="text-[11px] text-white/45 mt-1 leading-snug">
                  Defumado 160g · cheddar · bacon · cebola caramelizada
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-display text-xl font-bold text-amber-brand">R$ 35,00</span>
                  <span className="font-display text-[10px] font-semibold text-white/30 group-hover:text-amber-brand/70 transition-colors">
                    Ver cardápio →
                  </span>
                </div>
              </div>
            </div>

            {/* CATEGORY STRIP */}
            <div className="space-y-3">
              <p className="font-display text-[9px] font-semibold uppercase tracking-widest text-white/25">Categorias</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setActiveTab("menu"); }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.025] border border-white/[0.06] hover:border-amber-brand/25 hover:bg-white/[0.045] transition-all shrink-0 group"
                  >
                    <span className="text-sm leading-none">{CAT_ICON[cat.id]}</span>
                    <span className="font-display text-[11px] font-bold text-white/60 group-hover:text-white/90 transition-colors">
                      {CAT_LABEL[cat.id]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* POPULAR — horizontal scroll */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-[9px] font-semibold uppercase tracking-widest text-white/25">Mais Pedidos</p>
                <button
                  onClick={() => { setSelectedCategory("burgers"); setActiveTab("menu"); }}
                  className="font-display text-[10px] font-bold text-amber-brand hover:underline underline-offset-2"
                >
                  Ver todos
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
                {popularItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative w-44 shrink-0 rounded-2xl overflow-hidden flex flex-col"
                    style={{ background: "linear-gradient(160deg, #0f0804 0%, #0a0602 100%)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {/* Top amber accent */}
                    <div className="h-px bg-gradient-to-r from-amber-brand/60 via-amber-brand/20 to-transparent" />

                    <div className="p-3.5 flex flex-col flex-1 justify-between">
                      {item.badge && (
                        <span className="self-start text-[8px] font-bold uppercase tracking-wide bg-amber-brand/15 text-amber-brand px-2 py-0.5 rounded mb-2">
                          {item.badge}
                        </span>
                      )}
                      <div>
                        <span className="font-display text-base font-bold text-amber-brand block leading-none">
                          {formatBRL(item.price)}
                        </span>
                        <h4 className="font-display text-sm font-bold text-white/90 mt-1 leading-snug">{item.name}</h4>
                        <p className="text-[10px] text-white/30 mt-1.5 line-clamp-2 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => add(item)}
                        className="mt-3.5 w-full py-2 rounded-xl border border-amber-brand/20 bg-amber-brand/[0.06] text-amber-brand font-display text-[10px] font-bold uppercase tracking-widest hover:bg-amber-brand hover:text-black transition-all active:scale-95"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COMBO CTA */}
            <button
              onClick={() => { setSelectedCategory("combos"); setActiveTab("menu"); }}
              className="w-full rounded-2xl border border-amber-brand/20 overflow-hidden text-left group"
              style={{ background: "linear-gradient(135deg, rgba(232,163,61,0.05) 0%, rgba(200,134,10,0.03) 100%)" }}
            >
              <div className="h-px bg-gradient-to-r from-amber-brand/50 to-transparent" />
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-display text-[8px] font-bold uppercase tracking-widest text-amber-brand mb-1">Combos</p>
                  <h3 className="font-display text-[15px] font-bold text-white leading-tight">
                    A partir de <span className="text-amber-brand">R$ 45,90</span>
                  </h3>
                  <p className="text-[11px] text-white/35 mt-1">Burger + Refri + Batata. Personalizável.</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-brand/40 shrink-0 group-hover:text-amber-brand/70 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

          </div>
        )}

        {/* ══════════════════════════════════════
            MENU TAB
        ══════════════════════════════════════ */}
        {activeTab === "menu" && (
          <div className="space-y-5">

            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 font-display text-[11px] font-bold transition-all shrink-0 ${
                    selectedCategory === c.id
                      ? "bg-amber-brand text-black shadow shadow-amber-brand/20"
                      : "bg-white/[0.03] border border-white/[0.06] text-white/45 hover:text-white/80"
                  }`}
                >
                  {CAT_LABEL[c.id]}
                </button>
              ))}
            </div>

            {/* Section divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.04]" />
              <span className="font-display text-[9px] font-bold uppercase tracking-[0.3em] text-amber-brand/50">
                {CAT_LABEL[selectedCategory]}
              </span>
              <div className="h-px flex-1 bg-white/[0.04]" />
            </div>

            {/* Items */}
            <div className="divide-y divide-white/[0.04]">
              {menuItems.map((item) => {
                const isCombo = item.category === "combos";
                const cartQty = lines.filter((l) => l.item.id === item.id).reduce((s, l) => s + l.qty, 0);

                if (isCombo) {
                  return (
                    <div key={item.id} className="py-3.5">
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{ background: "linear-gradient(135deg, rgba(232,163,61,0.05), rgba(200,134,10,0.02))", border: "1px solid rgba(232,163,61,0.18)" }}
                      >
                        <div className="h-0.5 bg-gradient-to-r from-amber-brand via-amber-deep to-transparent" />
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <span className="inline-block text-[8px] font-bold uppercase tracking-widest text-amber-brand bg-amber-brand/10 px-2 py-0.5 rounded-full mb-2">
                                Combo
                              </span>
                              <h4 className="font-display text-[15px] font-bold text-white leading-snug">{item.name}</h4>
                              {item.desc && (
                                <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">{item.desc}</p>
                              )}
                            </div>
                            <span className="font-display text-lg font-bold text-amber-brand shrink-0">
                              {formatBRL(item.price)}
                            </span>
                          </div>
                          <button
                            onClick={() => startCustomizing(item)}
                            className="w-full py-2.5 rounded-xl bg-amber-brand text-black font-display text-[11px] font-bold uppercase tracking-widest hover:brightness-105 active:scale-[0.98] transition-all"
                          >
                            {cartQty > 0 ? `Adicionado (${cartQty}) — Adicionar outro` : "Personalizar e Adicionar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.id} className="py-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="font-display text-sm font-bold text-white/92 leading-tight">
                          {item.name}
                        </h4>
                        <span className="font-display text-sm font-bold text-amber-brand shrink-0">
                          {formatBRL(item.price)}
                        </span>
                      </div>
                      {item.badge && (
                        <span className="inline-block text-[8px] font-bold uppercase tracking-wider text-amber-brand mt-0.5">
                          ★ {item.badge}
                        </span>
                      )}
                      {item.desc && (
                        <p className="text-[11px] text-white/35 mt-1.5 leading-relaxed">
                          {highlightFlavors(item.desc).map((part, i) =>
                            part.flavor
                              ? <span key={i} className="text-amber-brand/60">{part.text}</span>
                              : <span key={i}>{part.text}</span>
                          )}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => add(item)}
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base font-bold transition active:scale-90 ${
                        cartQty > 0
                          ? "bg-amber-brand text-black text-xs font-black"
                          : "bg-white/[0.04] border border-white/[0.08] text-white/45 hover:bg-amber-brand hover:text-black hover:border-transparent"
                      }`}
                    >
                      {cartQty > 0 ? cartQty : "+"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            CART TAB
        ══════════════════════════════════════ */}
        {activeTab === "cart" && (
          <div className="space-y-6">
            {lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border border-white/[0.05] flex items-center justify-center text-3xl">
                  🛒
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white/70">Sacola vazia</h3>
                  <p className="text-xs text-white/30 mt-1.5 max-w-xs leading-relaxed">
                    Explore o cardápio e adicione seus burgers favoritos.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("menu")}
                  className="px-6 py-3 rounded-full bg-amber-brand text-black font-display font-bold text-xs uppercase tracking-widest hover:brightness-105 active:scale-[0.98] transition shadow shadow-amber-brand/15"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Item list */}
                <div className="divide-y divide-white/[0.04] max-h-[52vh] overflow-y-auto scrollbar-none">
                  {lines.map((l) => (
                    <div key={l.id} className="py-3.5 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm font-bold text-white/92 truncate">{l.item.name}</h4>
                        {l.choices && l.choices.length > 0 && (
                          <p className="text-[10px] text-amber-brand/70 mt-0.5 leading-snug break-words">{l.choices.join(" + ")}</p>
                        )}
                        <span className="text-[11px] text-white/30 block mt-0.5">{formatBRL(l.item.price)} cada</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => dec(l.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] text-white/60 hover:bg-white/[0.1] transition active:scale-90">−</button>
                        <span className="w-5 text-center text-xs font-bold text-white/85">{l.qty}</span>
                        <button onClick={() => inc(l.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] text-white/60 hover:bg-white/[0.1] transition active:scale-90">+</button>
                        <button onClick={() => remove(l.id)} className="ml-0.5 text-[10px] text-white/20 hover:text-white/50 p-1 transition">✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total + CTA */}
                <div
                  className="rounded-3xl overflow-hidden"
                  style={{ background: "linear-gradient(160deg, #0e0a04 0%, #090603 100%)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="h-px bg-gradient-to-r from-amber-brand/40 to-transparent" />
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[9px] font-semibold uppercase tracking-widest text-white/25">Total do Pedido</span>
                      <span className="font-display text-2xl font-bold text-amber-brand">{formatBRL(total)}</span>
                    </div>
                    <a
                      href={whatsappUrl(WHATSAPP)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl bg-amber-brand text-black font-display text-xs font-bold uppercase tracking-widest shadow shadow-amber-brand/15 hover:brightness-105 active:scale-[0.98] transition-all"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Finalizar no WhatsApp
                    </a>
                    <button
                      onClick={clear}
                      className="w-full text-center font-display text-[9px] font-semibold uppercase tracking-widest text-white/18 hover:text-white/40 transition"
                    >
                      Limpar sacola
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          BOTTOM NAV
      ══════════════════════════════════════ */}
      <nav className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto">
        <div className="bg-[#090909]/96 backdrop-blur-2xl border-t border-white/[0.04] rounded-t-3xl shadow-[0_-12px_48px_rgba(0,0,0,0.7)]">
          <div className="flex items-center justify-around px-3 py-3">

            {/* Início */}
            <button
              onClick={() => setActiveTab("home")}
              className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-colors duration-200 ${
                activeTab === "home" ? "text-amber-brand" : "text-white/30 hover:text-white/55"
              }`}
            >
              {activeTab === "home" && (
                <motion.div layoutId="navPill" className="absolute inset-0 rounded-2xl bg-amber-brand/[0.08] border border-amber-brand/12"
                  transition={{ type: "spring", stiffness: 420, damping: 38 }} />
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="relative z-10 font-display text-[9px] font-semibold tracking-wider">Início</span>
            </button>

            {/* Cardápio */}
            <button
              onClick={() => setActiveTab("menu")}
              className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-colors duration-200 ${
                activeTab === "menu" ? "text-amber-brand" : "text-white/30 hover:text-white/55"
              }`}
            >
              {activeTab === "menu" && (
                <motion.div layoutId="navPill" className="absolute inset-0 rounded-2xl bg-amber-brand/[0.08] border border-amber-brand/12"
                  transition={{ type: "spring", stiffness: 420, damping: 38 }} />
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10 font-display text-[9px] font-semibold tracking-wider">Cardápio</span>
            </button>

            {/* Sacola */}
            <button
              onClick={() => setActiveTab("cart")}
              className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-colors duration-200 ${
                activeTab === "cart" ? "text-amber-brand" : "text-white/30 hover:text-white/55"
              }`}
            >
              {activeTab === "cart" && (
                <motion.div layoutId="navPill" className="absolute inset-0 rounded-2xl bg-amber-brand/[0.08] border border-amber-brand/12"
                  transition={{ type: "spring", stiffness: 420, damping: 38 }} />
              )}
              <svg xmlns="http://www.w3.org/2000/svg" className="relative z-10 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 9.846 4.632 11 6 11h10a1 1 0 100-2H6l.5-1h7.5c.814 0 1.507-.57 1.687-1.354l1.307-5.23A1 1 0 0016 1h-3H3zm2.5 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
              </svg>
              <span className="relative z-10 font-display text-[9px] font-semibold tracking-wider">Sacola</span>
              {count > 0 && (
                <span className="absolute -top-0.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-brand text-[8px] font-black text-black z-20">
                  {count}
                </span>
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          COMBO CUSTOMIZER MODAL
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {customizingCombo && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCustomizingCombo(null)}
              className="absolute inset-0 bg-black/88 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[88vh]"
              style={{ background: "#0d0b08", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Top stripe */}
              <div className="h-0.5 bg-gradient-to-r from-amber-brand via-amber-deep to-transparent shrink-0" />

              {/* Header */}
              <div className="px-5 pt-5 pb-4 border-b border-white/[0.05] shrink-0">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-display text-[8px] font-bold uppercase tracking-widest text-amber-brand">Personalize</span>
                    <h3 className="font-display text-lg font-bold text-white mt-0.5">{customizingCombo.name}</h3>
                    <span className="font-display text-base font-bold text-amber-brand">{formatBRL(customizingCombo.price)}</span>
                  </div>
                  <button
                    onClick={() => setCustomizingCombo(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-white/35 hover:bg-white/[0.08] hover:text-white transition mt-0.5"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto py-5 px-5 space-y-5 scrollbar-none">
                {comboBurgers.map((selectedBurger, slotIdx) => (
                  <div key={slotIdx} className="space-y-2">
                    <p className="font-display text-[9px] font-bold uppercase tracking-widest text-white/30">
                      {comboBurgers.length > 1 ? `Hambúrguer ${slotIdx + 1}` : "Escolha seu Hambúrguer"}
                    </p>
                    <div className="space-y-1.5">
                      {BURGER_OPTIONS.map((burger) => {
                        const isSelected = selectedBurger === burger.id;
                        return (
                          <button
                            key={burger.id}
                            onClick={() => {
                              const updated = [...comboBurgers];
                              updated[slotIdx] = burger.id;
                              setComboBurgers(updated);
                            }}
                            className={`w-full flex flex-col text-left p-3 rounded-xl border transition-all ${
                              isSelected
                                ? "bg-amber-brand/[0.08] border-amber-brand/40"
                                : "bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.025]"
                            }`}
                          >
                            <span className={`font-display text-xs font-bold ${isSelected ? "text-amber-brand" : "text-white/75"}`}>
                              {burger.id}
                            </span>
                            <span className="text-[10px] text-white/30 mt-0.5 leading-relaxed">{burger.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {customizingCombo.id !== "combo-familia" && (
                  <div className="space-y-2">
                    <p className="font-display text-[9px] font-bold uppercase tracking-widest text-white/30">
                      Escolha a Bebida
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(customizingCombo.id === "combo-individual" ? SODA_LATA_OPTIONS : SODA_1L_OPTIONS).map((soda) => {
                        const isSelected = comboSoda === soda;
                        return (
                          <button
                            key={soda}
                            onClick={() => setComboSoda(soda)}
                            className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all ${
                              isSelected
                                ? "bg-amber-brand/[0.08] border-amber-brand/40 text-amber-brand"
                                : "bg-white/[0.01] border-white/[0.05] text-white/45 hover:bg-white/[0.025]"
                            }`}
                          >
                            {soda}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {customizingCombo.id === "combo-familia" && (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05]">
                    <span className="text-[11px] text-white/35">Refrigerante Incluso</span>
                    <span className="font-display text-xs font-bold text-amber-brand">Guaraná 1.5L</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="px-5 py-4 border-t border-white/[0.05] flex gap-2 shrink-0">
                <button
                  onClick={() => setCustomizingCombo(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/[0.04] text-white/50 font-display font-semibold text-xs uppercase tracking-widest hover:bg-white/[0.07] transition"
                >
                  Cancelar
                </button>
                <button
                  disabled={comboBurgers.some((b) => !b) || (!comboSoda && customizingCombo.id !== "combo-familia")}
                  onClick={() => {
                    const choices = [...comboBurgers];
                    if (comboSoda) choices.push(comboSoda);
                    add(customizingCombo, choices);
                    setCustomizingCombo(null);
                  }}
                  className={`flex-[2] py-3 rounded-2xl font-display font-bold text-xs tracking-widest uppercase transition ${
                    comboBurgers.some((b) => !b) || (!comboSoda && customizingCombo.id !== "combo-familia")
                      ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
                      : "bg-amber-brand text-black hover:brightness-105 active:scale-[0.98] shadow shadow-amber-brand/15"
                  }`}
                >
                  Adicionar ao Pedido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
