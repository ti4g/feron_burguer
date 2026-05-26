"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { formatBRL } from "@/lib/menu";

const WHATSAPP = "5563999614831";

export default function CartBar() {
  const { lines, count, total, inc, dec, remove, clear, whatsappUrl } =
    useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.button
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-md items-center justify-between rounded-full bg-amber-brand px-6 py-4 text-black shadow-2xl shadow-black/50 sm:left-auto sm:right-6 sm:w-80"
          >
            <span className="flex items-center gap-2 font-bold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/20 text-xs">
                {count}
              </span>
              Ver pedido
            </span>
            <span className="font-bold">{formatBRL(total)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85vh] w-full max-w-md overflow-hidden rounded-t-3xl border-t border-white/10 bg-[#0d0d0d]"
            >
              {/* header */}
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                <h3 className="text-lg font-bold text-white/90">Seu pedido</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-white/50 hover:text-white"
                >
                  Fechar
                </button>
              </div>

              {/* lines */}
              <div className="max-h-[45vh] overflow-y-auto px-5 py-3">
                {lines.length === 0 && (
                  <p className="py-10 text-center text-sm text-white/40">
                    Seu carrinho está vazio.
                  </p>
                )}
                {lines.map((l) => (
                  <div
                    key={l.item.id}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/90">
                        {l.item.name}
                      </p>
                      <p className="text-xs text-white/40">
                        {formatBRL(l.item.price)} cada
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => dec(l.item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-semibold text-white/90">
                        {l.qty}
                      </span>
                      <button
                        onClick={() => inc(l.item.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(l.item.id)}
                        className="ml-1 text-xs text-white/30 hover:text-white/60"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* footer */}
              <div className="border-t border-white/5 px-5 py-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="text-xl font-extrabold text-white">
                    {formatBRL(total)}
                  </span>
                </div>
                <a
                  href={whatsappUrl(WHATSAPP)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (lines.length === 0) e.preventDefault();
                  }}
                  className={`block w-full rounded-full py-4 text-center text-sm font-bold uppercase tracking-wide transition ${
                    lines.length === 0
                      ? "cursor-not-allowed bg-white/10 text-white/30"
                      : "bg-amber-brand text-black hover:brightness-110"
                  }`}
                >
                  Finalizar no WhatsApp
                </a>
                {lines.length > 0 && (
                  <button
                    onClick={clear}
                    className="mt-3 w-full text-center text-xs text-white/30 hover:text-white/60"
                  >
                    Limpar pedido
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
