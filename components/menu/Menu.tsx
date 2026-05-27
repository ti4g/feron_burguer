"use client";

import { useState } from "react";
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
  { id: "Mumu Burger", desc: "Brioche, defumado 160g, provolone, bacon em cubos e doce de leite defumado." },
];

const SODA_LATA_OPTIONS = [
  "Coca-Cola Lata",
  "Coca Zero Lata",
  "Guaraná Lata",
  "Guaraná Zero Lata",
  "Sprite Lata",
  "Schweppes Lata",
];

const SODA_1L_OPTIONS = [
  "Coca-Cola 1L",
  "Coca Zero 1L",
  "Guaraná 1L",
];

export default function Menu() {
  const [active, setActive] = useState<Category>("combos");
  const items = MENU.filter((i) => i.category === active);

  // States for combo customization modal
  const [customizingCombo, setCustomizingCombo] = useState<MenuItem | null>(null);
  const [comboBurgers, setComboBurgers] = useState<string[]>([]);
  const [comboSoda, setComboSoda] = useState<string>("");

  const startCustomizing = (item: MenuItem) => {
    setCustomizingCombo(item);
    const slots = item.id === "combo-individual" ? 1 : item.id === "combo-casal" ? 2 : 4;
    setComboBurgers(new Array(slots).fill(""));
    setComboSoda(
      item.id === "combo-familia" 
        ? "Guaraná 1.5L" 
        : ""
    );
  };

  return (
    <section id="cardapio" className="relative z-10 bg-void px-5 pb-36 pt-20">
      {/* Background glow decors */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-amber-brand/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[300px] h-[300px] rounded-full bg-amber-deep/[0.015] blur-[80px] pointer-events-none" />

      {/* Bridge / header */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="rounded-full bg-amber-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-brand">
          O Cardápio 📖
        </span>
        <h2 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Escolha o seu Feron
        </h2>
        <p className="mt-3 text-sm text-white/50 max-w-md mx-auto">
          Monte o seu combo ou escolha entre nossos burgers defumados e porções artesanais.
        </p>
      </div>

      {/* Sticky category nav */}
      <div className="sticky top-0 z-20 -mx-5 mb-10 border-b border-white/5 bg-void/85 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto scrollbar-none pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition-all duration-200 z-10 text-white/60 hover:text-white"
            >
              {active === c.id && (
                <motion.div
                  layoutId="activeCategoryTab"
                  className="absolute inset-0 rounded-full bg-amber-brand z-[-1] shadow-[0_4px_12px_rgba(232,163,61,0.25)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={active === c.id ? "text-black font-extrabold" : ""}>
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Card 
            key={item.id} 
            item={item} 
            onAdd={() => {
              if (item.category === "combos") {
                startCustomizing(item);
              }
            }} 
          />
        ))}
      </div>

      {/* Glassmorphic Customizer Modal */}
      <AnimatePresence>
        {customizingCombo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizingCombo(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-brand">
                    Personalize seu Combo 🎁
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {customizingCombo.name}
                  </h3>
                </div>
                <button
                  onClick={() => setCustomizingCombo(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto py-5 pr-1 space-y-6 scrollbar-none">
                {/* Burger Slots */}
                {comboBurgers.map((selectedBurger, slotIdx) => (
                  <div key={slotIdx} className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white/50">
                      Hambúrguer {comboBurgers.length > 1 ? slotIdx + 1 : ""}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
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
                            className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                              isSelected
                                ? "bg-amber-brand/10 border-amber-brand text-white shadow-[0_0_15px_rgba(232,163,61,0.06)]"
                                : "bg-white/[0.02] border-white/5 text-white/80 hover:bg-white/[0.04] hover:border-white/10"
                            }`}
                          >
                            <span className={`text-sm font-bold ${isSelected ? "text-amber-brand" : "text-white"}`}>
                              {burger.id}
                            </span>
                            <span className="text-xs text-white/40 mt-1 font-medium leading-relaxed">
                              {burger.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Soda Slots */}
                {customizingCombo.id !== "combo-familia" && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-white/50">
                      Escolha a Bebida 🥤
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(customizingCombo.id === "combo-individual" ? SODA_LATA_OPTIONS : SODA_1L_OPTIONS).map((soda) => {
                        const isSelected = comboSoda === soda;
                        return (
                          <button
                            key={soda}
                            onClick={() => setComboSoda(soda)}
                            className={`p-3 rounded-2xl border text-sm font-bold text-center transition-all ${
                              isSelected
                                ? "bg-amber-brand/10 border-amber-brand text-amber-brand"
                                : "bg-white/[0.02] border-white/5 text-white/70 hover:bg-white/[0.04] hover:border-white/10"
                            }`}
                          >
                            {soda}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pre-defined drinks note for Familia */}
                {customizingCombo.id === "combo-familia" && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span className="text-sm font-bold text-white/60">Refrigerante Incluso:</span>
                    <span className="text-sm font-black text-amber-brand">Guaraná 1.5L 🥤</span>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-white/5 flex gap-3">
                <button
                  onClick={() => setCustomizingCombo(null)}
                  className="flex-1 py-4 rounded-full bg-white/5 text-white font-bold text-sm transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  disabled={comboBurgers.some((b) => !b) || (!comboSoda && customizingCombo.id !== "combo-familia")}
                  onClick={() => {
                    const choices = [...comboBurgers];
                    if (comboSoda) choices.push(comboSoda);
                    
                    const { add } = useCart();
                    // Custom implementation of trigger
                    const fullItem = MENU.find(m => m.id === customizingCombo.id)!;
                    add(fullItem, choices);
                    setCustomizingCombo(null);
                  }}
                  className={`flex-[2] py-4 rounded-full font-extrabold text-sm text-center tracking-wide uppercase transition shadow-lg ${
                    comboBurgers.some((b) => !b) || (!comboSoda && customizingCombo.id !== "combo-familia")
                      ? "bg-white/10 text-white/30 cursor-not-allowed shadow-none"
                      : "bg-amber-brand text-black hover:brightness-115 hover:shadow-amber-brand/20"
                  }`}
                >
                  Confirmar — {formatBRL(customizingCombo.price)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

interface CardProps {
  item: MenuItem;
  onAdd: () => void;
}

function Card({ item, onAdd }: CardProps) {
  const { add, lines } = useCart();
  const cartQty = lines
    .filter((l) => l.item.id === item.id)
    .reduce((s, l) => s + l.qty, 0);

  const isCombo = item.category === "combos";

  const handleAction = () => {
    if (isCombo) {
      onAdd();
    } else {
      add(item);
    }
  };

  return (
    <div 
      className={`relative flex flex-col justify-between rounded-3xl border p-5 transition-all duration-300 ${
        isCombo 
          ? "border-amber-brand/15 bg-gradient-to-b from-amber-brand/[0.03] to-white/[0.01] hover:border-amber-brand/35 hover:shadow-[0_0_35px_rgba(232,163,61,0.06)] sm:col-span-2 md:col-span-1"
          : "border-white/5 bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.03] hover:shadow-[0_0_25px_rgba(255,255,255,0.02)]"
      }`}
    >
      {/* Decorative tag for items with badges */}
      {item.badge && (
        <span className="absolute top-4 right-4 text-[9px] uppercase font-black tracking-widest bg-amber-brand text-black px-2.5 py-0.5 rounded-full shadow-lg shadow-amber-brand/10">
          {item.badge}
        </span>
      )}

      {/* Combos decorative tag */}
      {isCombo && !item.badge && (
        <span className="absolute top-4 right-4 text-[9px] uppercase font-black tracking-widest bg-amber-deep text-white px-2.5 py-0.5 rounded-full shadow-lg">
          OFERTA ESPECIAL 🎁
        </span>
      )}

      <div className="pr-12">
        <div className="flex flex-col">
          <h3 className="text-lg font-black text-white/95 leading-tight">{item.name}</h3>
          <span className={`text-lg font-extrabold mt-1 ${isCombo ? "text-amber-brand" : "text-white/60"}`}>
            {formatBRL(item.price)}
          </span>
        </div>
        
        {item.desc && (
          <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-white/50">
            {highlightFlavors(item.desc).map((part, i) =>
              part.flavor ? (
                <span key={i} className="text-amber-brand font-semibold">
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 pt-4 border-t border-white/[0.03]">
        {isCombo ? (
          <span className="text-[10px] font-bold text-amber-brand/70 uppercase tracking-widest flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-brand animate-pulse" />
            Totalmente Personalizável
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">
            Adicionar avulso
          </span>
        )}

        <button
          onClick={handleAction}
          className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide transition-all duration-300 transform active:scale-95 ${
            cartQty > 0
              ? "bg-amber-brand text-black shadow-lg shadow-amber-brand/15"
              : "bg-white/5 text-white/80 hover:bg-amber-brand hover:text-black hover:shadow-lg hover:shadow-amber-brand/15"
          }`}
        >
          {cartQty > 0 ? `Adicionado (${cartQty})` : isCombo ? "⚡ Personalizar" : "+ Adicionar"}
        </button>
      </div>
    </div>
  );
}
