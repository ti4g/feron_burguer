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

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: [0.22, 0, 0.1, 1] } },
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

  const goToMenu = (cat: Category) => {
    setSelectedCategory(cat);
    setActiveTab("menu");
  };

  return (
    <div
      id="app-interface"
      className="relative z-10 bg-void min-h-screen max-w-md mx-auto border-x border-white/[0.04] shadow-2xl"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-[25%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-amber-brand/[0.032] blur-[130px]" />
      <div className="pointer-events-none fixed bottom-[15%] right-1/4 w-[280px] h-[280px] rounded-full bg-amber-deep/[0.025] blur-[110px]" />

      <div className="px-4 pb-32 pt-10">

        {/* ── HEADER ── */}
        <header className="flex items-center justify-between mb-8">
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div key="h-home" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.16 }}>
                <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-amber-brand/70">Bem-vindo à</p>
                <h1 className="font-display text-[28px] font-bold text-white leading-tight mt-0.5">
                  FERON <span className="text-amber-brand">BURGER</span>
                </h1>
              </motion.div>
            )}
            {activeTab === "menu" && (
              <motion.div key="h-menu" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.16 }}>
                <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-amber-brand/70">Cardápio</p>
                <h1 className="font-display text-[28px] font-bold text-white leading-tight mt-0.5">Escolha o seu</h1>
              </motion.div>
            )}
            {activeTab === "cart" && (
              <motion.div key="h-cart" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.16 }}>
                <p className="font-display text-[9px] font-semibold uppercase tracking-[0.4em] text-amber-brand/70">Sua Sacola</p>
                <h1 className="font-display text-[28px] font-bold text-white leading-tight mt-0.5">
                  {count > 0 ? `${count} ${count === 1 ? "item" : "itens"}` : "Finalizar Pedido"}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab("cart")}
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/[0.07] text-white/55 hover:bg-amber-brand/[0.08] hover:text-amber-brand hover:border-amber-brand/20 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                  className="absolute -top-1.5 -right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-amber-brand text-[9px] font-black text-black shadow-lg shadow-amber-brand/40"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </header>

        {/* ══════════════════════════════════════
            HOME TAB
        ══════════════════════════════════════ */}
        {activeTab === "home" && (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

            {/* ── HERO CARD ── */}
            <motion.div variants={fadeUp}>
              <div
                onClick={() => goToMenu("burgers")}
                className="relative rounded-[22px] overflow-hidden cursor-pointer group h-[220px] select-none"
                style={{ background: "linear-gradient(140deg, #130c01 0%, #0d0800 50%, #110a01 100%)" }}
              >
                {/* Left amber stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-brand/90 via-amber-deep/60 to-transparent" />

                {/* Radial glow */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-brand/[0.055] blur-3xl" />

                {/* Subtle dot grid */}
                <div
                  className="absolute inset-0 opacity-[0.018]"
                  style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
                />

                {/* Logo watermark */}
                <img
                  src="/logo-feron.png"
                  alt=""
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-[148px] h-[148px] opacity-[0.065] group-hover:opacity-[0.12] transition-all duration-700 group-hover:scale-110"
                />

                {/* Bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center gap-1.5 bg-amber-brand/[0.12] border border-amber-brand/25 text-amber-brand font-display text-[8px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                      <span className="text-[9px]">★</span> Mais Pedido
                    </span>
                    <span className="font-display text-[24px] font-bold text-amber-brand leading-none tabular-nums">
                      {formatBRL(35)}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div>
                    <h2 className="font-display text-[30px] font-bold text-white leading-none tracking-tight">
                      Feron Burger
                    </h2>
                    <p className="text-[11px] text-white/40 mt-2 leading-snug">
                      Defumado 160g · cheddar · bacon · cebola caramelizada
                    </p>
                    <div className="flex items-center gap-1.5 mt-4 text-amber-brand/60 group-hover:text-amber-brand transition-colors duration-300">
                      <span className="font-display text-[10px] font-bold uppercase tracking-widest">Ver cardápio</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── CATEGORIAS ── */}
            <motion.div variants={fadeUp} className="space-y-2.5">
              <p className="font-display text-[8px] font-bold uppercase tracking-[0.35em] text-white/18">Categorias</p>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => goToMenu(cat.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/[0.025] border border-white/[0.06] hover:border-amber-brand/25 hover:bg-amber-brand/[0.04] transition-all shrink-0 group"
                  >
                    <span className="text-xs leading-none">{CAT_ICON[cat.id]}</span>
                    <span className="font-display text-[11px] font-semibold text-white/50 group-hover:text-white/90 transition-colors whitespace-nowrap">
                      {CAT_LABEL[cat.id]}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── MAIS PEDIDOS ── */}
            <motion.div variants={fadeUp} className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-display text-[8px] font-bold uppercase tracking-[0.35em] text-white/18">Mais Pedidos</p>
                <button
                  onClick={() => goToMenu("burgers")}
                  className="font-display text-[10px] font-bold text-amber-brand/60 hover:text-amber-brand transition-colors"
                >
                  Ver todos →
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
                {popularItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.065, duration: 0.28, ease: [0.22, 0, 0.1, 1] }}
                    className="relative w-[172px] shrink-0 rounded-[18px] overflow-hidden flex flex-col group"
                    style={{ background: "linear-gradient(160deg, #111007 0%, #0a0804 100%)", border: "1px solid rgba(255,255,255,0.052)" }}
                  >
                    {/* Top amber line */}
                    <div className="h-px bg-gradient-to-r from-amber-brand/45 via-amber-brand/15 to-transparent" />

                    <div className="p-3.5 flex flex-col flex-1 gap-2.5">
                      {item.badge && (
                        <span className="self-start text-[7px] font-bold uppercase tracking-widest bg-amber-brand/10 border border-amber-brand/18 text-amber-brand px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      <div className="flex-1 space-y-1">
                        <h4 className="font-display text-[13px] font-bold text-white/92 leading-snug">{item.name}</h4>
                        <p className="text-[10px] text-white/25 line-clamp-2 leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="font-display text-[15px] font-bold text-amber-brand leading-none">{formatBRL(item.price)}</span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => add(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-brand/[0.08] border border-amber-brand/20 text-amber-brand text-sm font-bold group-hover:bg-amber-brand group-hover:text-black group-hover:border-transparent transition-all duration-200"
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── TRUST BAR ── */}
            <motion.div variants={fadeUp}>
              <div className="grid grid-cols-3 divide-x divide-white/[0.05] rounded-2xl border border-white/[0.05] bg-white/[0.015] overflow-hidden">
                {[
                  { val: "160g", label: "Carne Defumada" },
                  { val: "5", label: "Burgers Únicos" },
                  { val: "Zap", label: "Pedido Rápido" },
                ].map((s, i) => (
                  <div key={i} className="py-3.5 text-center">
                    <p className="font-display text-[15px] font-bold text-amber-brand leading-none">{s.val}</p>
                    <p className="font-display text-[8px] text-white/25 mt-1.5 uppercase tracking-wide leading-none">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── COMBO CTA ── */}
            <motion.div variants={fadeUp}>
              <button
                onClick={() => goToMenu("combos")}
                className="w-full rounded-[18px] overflow-hidden text-left group relative"
                style={{ background: "linear-gradient(130deg, rgba(232,163,61,0.07) 0%, rgba(200,134,10,0.04) 100%)", border: "1px solid rgba(232,163,61,0.14)" }}
              >
                <div className="h-px bg-gradient-to-r from-amber-brand/55 to-transparent" />
                <div className="px-5 py-4.5 flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <span className="inline-block bg-amber-brand/12 border border-amber-brand/22 text-amber-brand font-display text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                      Melhor custo-benefício
                    </span>
                    <h3 className="font-display text-[15px] font-bold text-white leading-tight">
                      Monte seu Combo
                    </h3>
                    <p className="text-[11px] text-white/35">
                      Burger + Batata + Refri · a partir de{" "}
                      <span className="text-amber-brand font-semibold">R$ 45,90</span>
                    </p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-brand/[0.08] border border-amber-brand/18 text-amber-brand group-hover:bg-amber-brand group-hover:text-black transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </motion.div>

          </motion.div>
        )}

        {/* ══════════════════════════════════════
            MENU TAB
        ══════════════════════════════════════ */}
        {activeTab === "menu" && (
          <div className="space-y-5">

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5 -mx-4 px-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 font-display text-[11px] font-bold transition-all duration-200 shrink-0 ${
                    selectedCategory === c.id
                      ? "bg-amber-brand text-black shadow-lg shadow-amber-brand/25"
                      : "bg-white/[0.03] border border-white/[0.06] text-white/38 hover:text-white/70 hover:border-white/10"
                  }`}
                >
                  {CAT_LABEL[c.id]}
                </button>
              ))}
            </div>

            {/* Section label */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.055]" />
              <span className="font-display text-[8px] font-bold uppercase tracking-[0.35em] text-amber-brand/40">
                {CAT_LABEL[selectedCategory]}
              </span>
              <div className="h-px flex-1 bg-white/[0.055]" />
            </div>

            {/* Items list */}
            <motion.div
              key={selectedCategory}
              variants={stagger}
              initial="hidden"
              animate="show"
              className="divide-y divide-white/[0.045]"
            >
              {menuItems.map((item) => {
                const isCombo = item.category === "combos";
                const cartQty = lines.filter((l) => l.item.id === item.id).reduce((s, l) => s + l.qty, 0);

                if (isCombo) {
                  return (
                    <motion.div key={item.id} variants={fadeUp} className="py-3.5">
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{ background: "linear-gradient(135deg, rgba(232,163,61,0.06), rgba(200,134,10,0.025))", border: "1px solid rgba(232,163,61,0.18)" }}
                      >
                        <div className="h-0.5 bg-gradient-to-r from-amber-brand via-amber-deep to-transparent" />
                        <div className="p-4 space-y-3.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1.5">
                              <span className="inline-block text-[7px] font-bold uppercase tracking-widest text-amber-brand bg-amber-brand/10 border border-amber-brand/18 px-2 py-0.5 rounded-full">
                                Combo
                              </span>
                              <h4 className="font-display text-[15px] font-bold text-white leading-snug">{item.name}</h4>
                              {item.desc && (
                                <p className="text-[11px] text-white/32 leading-relaxed">{item.desc}</p>
                              )}
                            </div>
                            <span className="font-display text-xl font-bold text-amber-brand shrink-0 leading-none pt-0.5">
                              {formatBRL(item.price)}
                            </span>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => startCustomizing(item)}
                            className="w-full py-3 rounded-xl bg-amber-brand text-black font-display text-[11px] font-bold uppercase tracking-widest hover:brightness-105 transition-all shadow-lg shadow-amber-brand/15"
                          >
                            {cartQty > 0 ? `✓ Adicionado (${cartQty}) — Adicionar outro` : "Personalizar e Adicionar"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div key={item.id} variants={fadeUp} className="py-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className="font-display text-[13px] font-bold text-white/90 leading-tight">{item.name}</h4>
                        <span className="font-display text-[15px] font-bold text-amber-brand shrink-0 leading-none">{formatBRL(item.price)}</span>
                      </div>
                      {item.badge && (
                        <span className="inline-block text-[7px] font-bold uppercase tracking-widest text-amber-brand/80 mt-0.5">
                          ★ {item.badge}
                        </span>
                      )}
                      {item.desc && (
                        <p className="text-[11px] text-white/28 mt-1.5 leading-relaxed">
                          {highlightFlavors(item.desc).map((part, i) =>
                            part.flavor
                              ? <span key={i} className="text-amber-brand/60">{part.text}</span>
                              : <span key={i}>{part.text}</span>
                          )}
                        </p>
                      )}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => add(item)}
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                        cartQty > 0
                          ? "bg-amber-brand text-black text-xs font-black shadow-md shadow-amber-brand/30"
                          : "bg-white/[0.04] border border-white/[0.08] text-white/38 hover:bg-amber-brand hover:text-black hover:border-transparent"
                      }`}
                    >
                      {cartQty > 0 ? cartQty : "+"}
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* ══════════════════════════════════════
            CART TAB
        ══════════════════════════════════════ */}
        {activeTab === "cart" && (
          <div className="space-y-5">
            {lines.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="flex flex-col items-center justify-center py-20 text-center space-y-5"
              >
                <div className="relative w-20 h-20 rounded-full border border-white/[0.07] flex items-center justify-center text-[34px]">
                  🛒
                  <div className="absolute inset-0 rounded-full bg-amber-brand/[0.025]" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-bold text-white/65">Sacola vazia</h3>
                  <p className="text-[12px] text-white/28 max-w-[200px] leading-relaxed">
                    Adicione seus favoritos e finalize pelo WhatsApp.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("menu")}
                  className="px-7 py-3 rounded-full bg-amber-brand text-black font-display font-bold text-[11px] uppercase tracking-widest hover:brightness-105 active:scale-[0.97] transition shadow-lg shadow-amber-brand/20"
                >
                  Explorar Cardápio
                </button>
              </motion.div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">

                {/* Item list */}
                <div className="divide-y divide-white/[0.05]">
                  {lines.map((l) => (
                    <motion.div key={l.id} variants={fadeUp} className="py-3.5 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-[13px] font-bold text-white/90 truncate">{l.item.name}</h4>
                        {l.choices && l.choices.length > 0 && (
                          <p className="text-[10px] text-amber-brand/60 mt-0.5 leading-snug break-words">{l.choices.join(" · ")}</p>
                        )}
                        <span className="text-[11px] text-white/25 block mt-0.5">{formatBRL(l.item.price)} cada</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => dec(l.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.06] text-white/50 hover:bg-white/[0.09] transition-all text-base font-bold leading-none">−</motion.button>
                        <span className="w-5 text-center text-[13px] font-bold text-white/88 font-display tabular-nums">{l.qty}</span>
                        <motion.button whileTap={{ scale: 0.85 }} onClick={() => inc(l.id)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.06] text-white/50 hover:bg-white/[0.09] transition-all text-base font-bold leading-none">+</motion.button>
                        <button onClick={() => remove(l.id)} className="ml-1 flex h-7 w-5 items-center justify-center text-[11px] text-white/15 hover:text-red-400/55 transition-colors">✕</button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order summary card */}
                <motion.div
                  variants={fadeUp}
                  className="rounded-3xl overflow-hidden"
                  style={{ background: "linear-gradient(155deg, #100d06 0%, #0b0903 100%)", border: "1px solid rgba(255,255,255,0.065)" }}
                >
                  <div className="h-px bg-gradient-to-r from-amber-brand/50 via-amber-brand/18 to-transparent" />
                  <div className="p-5 space-y-4">

                    {/* Line items */}
                    <div className="space-y-2">
                      {lines.map((l) => (
                        <div key={l.id} className="flex items-center justify-between gap-2">
                          <span className="text-[11px] text-white/28 truncate">{l.qty}× {l.item.name}</span>
                          <span className="text-[11px] font-display font-semibold text-white/42 shrink-0">{formatBRL(l.qty * l.item.price)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-white/[0.07]" />

                    {/* Total */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-display text-[8px] font-bold uppercase tracking-widest text-white/25">Total do Pedido</p>
                        <p className="font-display text-[9px] text-white/18 mt-0.5">Entrega a combinar</p>
                      </div>
                      <span className="font-display text-[32px] font-bold text-amber-brand leading-none tabular-nums">{formatBRL(total)}</span>
                    </div>

                    {/* WhatsApp CTA */}
                    <motion.a
                      whileTap={{ scale: 0.97 }}
                      href={whatsappUrl(WHATSAPP)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-[15px] rounded-2xl bg-amber-brand text-black font-display text-[12px] font-bold uppercase tracking-widest shadow-xl shadow-amber-brand/22 hover:brightness-105 transition-all"
                    >
                      <svg className="w-[17px] h-[17px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Finalizar no WhatsApp
                    </motion.a>

                    <button
                      onClick={clear}
                      className="w-full text-center font-display text-[9px] font-semibold uppercase tracking-widest text-white/14 hover:text-white/32 transition-colors"
                    >
                      Limpar sacola
                    </button>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          BOTTOM NAV
      ══════════════════════════════════════ */}
      <nav className="fixed bottom-0 inset-x-0 z-40 max-w-md mx-auto">
        <div
          className="border-t border-white/[0.05] rounded-t-3xl"
          style={{ background: "rgba(5,4,2,0.97)", backdropFilter: "blur(28px) saturate(110%)" }}
        >
          <div className="flex items-center justify-around px-2 pb-2 pt-3">
            {([
              {
                id: "home" as const,
                label: "Início",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                ),
              },
              {
                id: "menu" as const,
                label: "Cardápio",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                ),
              },
              {
                id: "cart" as const,
                label: "Sacola",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 9.846 4.632 11 6 11h10a1 1 0 100-2H6l.5-1h7.5c.814 0 1.507-.57 1.687-1.354l1.307-5.23A1 1 0 0016 1h-3H3zm2.5 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                ),
              },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center gap-1 px-6 py-1.5 rounded-2xl transition-colors duration-200 ${
                  activeTab === tab.id ? "text-amber-brand" : "text-white/25 hover:text-white/52"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 rounded-2xl bg-amber-brand/[0.08] border border-amber-brand/10"
                    transition={{ type: "spring", stiffness: 420, damping: 38 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10 font-display text-[9px] font-semibold tracking-wider">{tab.label}</span>
                {tab.id === "cart" && count > 0 && (
                  <AnimatePresence>
                    <motion.span
                      key="nav-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 28 }}
                      className="absolute -top-0.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-brand text-[8px] font-black text-black z-20"
                    >
                      {count}
                    </motion.span>
                  </AnimatePresence>
                )}
              </button>
            ))}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizingCombo(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-[10px]"
            />
            <motion.div
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              transition={{ type: "spring", stiffness: 310, damping: 27 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[88vh]"
              style={{ background: "#0e0b06", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="h-0.5 bg-gradient-to-r from-amber-brand via-amber-deep to-transparent shrink-0" />

              {/* Header */}
              <div className="px-5 pt-5 pb-4 border-b border-white/[0.055] shrink-0">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-display text-[8px] font-bold uppercase tracking-widest text-amber-brand/75">Personalize</span>
                    <h3 className="font-display text-lg font-bold text-white mt-0.5">{customizingCombo.name}</h3>
                    <span className="font-display text-[15px] font-bold text-amber-brand">{formatBRL(customizingCombo.price)}</span>
                  </div>
                  <button
                    onClick={() => setCustomizingCombo(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.06] text-white/30 hover:text-white/70 hover:bg-white/[0.08] transition mt-0.5"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto py-5 px-5 space-y-5 scrollbar-none">
                {comboBurgers.map((selectedBurger, slotIdx) => (
                  <div key={slotIdx} className="space-y-2">
                    <p className="font-display text-[8px] font-bold uppercase tracking-widest text-white/24">
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
                            className={`w-full flex flex-col text-left p-3 rounded-xl border transition-all duration-150 ${
                              isSelected
                                ? "bg-amber-brand/[0.08] border-amber-brand/38"
                                : "bg-white/[0.015] border-white/[0.05] hover:bg-white/[0.03]"
                            }`}
                          >
                            <span className={`font-display text-xs font-bold ${isSelected ? "text-amber-brand" : "text-white/70"}`}>
                              {burger.id}
                            </span>
                            <span className="text-[10px] text-white/26 mt-0.5 leading-relaxed">{burger.desc}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {customizingCombo.id !== "combo-familia" && (
                  <div className="space-y-2">
                    <p className="font-display text-[8px] font-bold uppercase tracking-widest text-white/24">Escolha a Bebida</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(customizingCombo.id === "combo-individual" ? SODA_LATA_OPTIONS : SODA_1L_OPTIONS).map((soda) => {
                        const isSelected = comboSoda === soda;
                        return (
                          <button
                            key={soda}
                            onClick={() => setComboSoda(soda)}
                            className={`p-2.5 rounded-xl border font-display text-[11px] font-bold text-center transition-all duration-150 ${
                              isSelected
                                ? "bg-amber-brand/[0.08] border-amber-brand/38 text-amber-brand"
                                : "bg-white/[0.015] border-white/[0.05] text-white/38 hover:bg-white/[0.03]"
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
                  <div className="flex items-center justify-between p-3 rounded-xl border border-amber-brand/14 bg-amber-brand/[0.03]">
                    <span className="text-[11px] text-white/30">Refrigerante Incluso</span>
                    <span className="font-display text-xs font-bold text-amber-brand">Guaraná 1.5L</span>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="px-5 py-4 border-t border-white/[0.055] flex gap-2.5 shrink-0">
                <button
                  onClick={() => setCustomizingCombo(null)}
                  className="flex-1 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-white/42 font-display font-semibold text-[11px] uppercase tracking-widest hover:bg-white/[0.07] transition"
                >
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={comboBurgers.some((b) => !b) || (!comboSoda && customizingCombo.id !== "combo-familia")}
                  onClick={() => {
                    const choices = [...comboBurgers];
                    if (comboSoda) choices.push(comboSoda);
                    add(customizingCombo, choices);
                    setCustomizingCombo(null);
                  }}
                  className={`flex-[2] py-3 rounded-2xl font-display font-bold text-[11px] tracking-widest uppercase transition-all ${
                    comboBurgers.some((b) => !b) || (!comboSoda && customizingCombo.id !== "combo-familia")
                      ? "bg-white/[0.04] text-white/18 cursor-not-allowed"
                      : "bg-amber-brand text-black hover:brightness-105 shadow-lg shadow-amber-brand/18"
                  }`}
                >
                  Adicionar ao Pedido
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
