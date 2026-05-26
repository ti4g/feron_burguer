"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  MotionValue,
} from "framer-motion";

const FRAME_COUNT = 112;
const WHATSAPP = "5563999614831";
// Burger frame height as a fraction of the viewport — keeps it floating
// as part of a composition rather than filling (and cropping) the screen.
const HEIGHT_FRAC = 0.55;

function framePath(index: number) {
  const clamped = Math.min(FRAME_COUNT, Math.max(1, index));
  return `/sequence/ezgif-frame-${String(clamped).padStart(3, "0")}.webp`;
}

/** Scale the frame by HEIGHT, centered, so the whole burger is visible
 *  (never cropped) and floats in the #050505 void. Width may overflow the
 *  screen (only dark background is clipped). */
function drawFloating(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = (ch * HEIGHT_FRAC) / ih;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

export default function BurgerSequence() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Preload all frames with progress tracking.
  useEffect(() => {
    let cancelled = false;
    let count = 0;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      const done = () => {
        if (cancelled) return;
        count++;
        setLoaded(count);
        if (count === FRAME_COUNT) setReady(true);
      };
      img.onload = done;
      img.onerror = done;
      imgs[i - 1] = img;
    }
    imagesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, []);

  // Retina-aware canvas sizing.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawNow(currentFrameRef.current || 1, true);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const drawNow = (frameIndex: number, force = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[frameIndex - 1];
    if (!img || !img.complete || !img.naturalWidth) return;
    if (!force && frameIndex === currentFrameRef.current) return;
    currentFrameRef.current = frameIndex;
    drawFloating(ctx, img, canvas.width, canvas.height);
  };

  useMotionValueEvent(smooth, "change", (v) => {
    const frame = Math.min(FRAME_COUNT, Math.floor(v * (FRAME_COUNT - 1)) + 1);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => drawNow(frame));
  });

  useEffect(() => {
    if (ready) drawNow(1, true);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const progressPct = Math.round((loaded / FRAME_COUNT) * 100);

  return (
    <section ref={wrapperRef} className="relative h-[400vh] w-full">
      {!ready && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void">
          <div className="mb-6 h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-amber-brand" />
          <div className="h-[2px] w-48 overflow-hidden rounded bg-white/10">
            <div
              className="h-full bg-amber-brand transition-[width] duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">
            Preparando {progressPct}%
          </p>
        </div>
      )}

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="block h-full w-full" />

        {/* Side vignette */}
        <div className="vignette-overlay" />

        {/* Edge fades on all four sides. Solid #050505 up to just past the
            floating frame's edge, then dissolve over the burger — so the
            container rectangle disappears completely (no visible seam). */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[30vh]"
          style={{
            background:
              "linear-gradient(to bottom, #050505 0%, #050505 72%, rgba(5,5,5,0) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[32vh]"
          style={{
            background:
              "linear-gradient(to top, #050505 0%, #050505 68%, rgba(5,5,5,0) 100%)",
          }}
        />
        {/* Side fades only on wider screens — on mobile the frame overflows
            the sides (no seam), so we skip them to avoid darkening the burger. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[18vw] lg:block"
          style={{
            background:
              "linear-gradient(to right, #050505 0%, #050505 20%, rgba(5,5,5,0) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 hidden w-[18vw] lg:block"
          style={{
            background:
              "linear-gradient(to left, #050505 0%, #050505 20%, rgba(5,5,5,0) 100%)",
          }}
        />

        {/* ----- TOP zone: rotating titles ----- */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[28vh] items-end justify-center px-6 pb-2 text-center">
          <Fade progress={smooth} range={[0, 0.22]} startVisible>
            <div className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-feron.png"
                alt="Feron Burger"
                className="mb-3 h-28 w-28 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:h-32 sm:w-32"
              />
              <h1 className="text-legible text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                FERON BURGER
              </h1>
            </div>
          </Fade>
          <Fade progress={smooth} range={[0.28, 0.48]}>
            <h2 className="text-legible text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Defumado de verdade
            </h2>
          </Fade>
          <Fade progress={smooth} range={[0.54, 0.72]}>
            <h2 className="text-legible text-4xl font-bold tracking-tight text-white sm:text-5xl">
              O toque secreto
            </h2>
          </Fade>
          <Fade progress={smooth} range={[0.78, 1]}>
            <h2 className="text-legible text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              Bateu a fome?
            </h2>
          </Fade>
        </div>

        {/* ----- BOTTOM zone: rotating copy + CTA ----- */}
        <div className="absolute inset-x-0 bottom-0 flex h-[30vh] items-start justify-center px-6 pt-2 text-center">
          <Fade progress={smooth} range={[0, 0.22]} startVisible>
            <p className="text-legible max-w-sm text-base text-white/80 sm:text-lg">
              O sabor que se constrói camada por camada.
            </p>
          </Fade>
          <Fade progress={smooth} range={[0.28, 0.48]}>
            <p className="text-legible max-w-sm text-base text-white/80 sm:text-lg">
              Burger 160g, <span className="flavor">provolone derretido</span> e
              bacon em cubos.
            </p>
          </Fade>
          <Fade progress={smooth} range={[0.54, 0.72]}>
            <p className="text-legible max-w-sm text-base text-white/80 sm:text-lg">
              Finalizado com <span className="flavor">doce de leite</span> —
              doce e defumado na mesma mordida.
            </p>
          </Fade>
          <Fade progress={smooth} range={[0.78, 1]}>
            <div className="flex flex-col items-center">
              <p className="text-legible text-base text-white/80 sm:text-lg">
                Peça agora pelo WhatsApp.
              </p>
              <CTA progress={smooth} whatsapp={WHATSAPP} />
            </div>
          </Fade>
        </div>

        <ScrollHint progress={smooth} />
      </div>
    </section>
  );
}

/* ---------- helpers ---------- */

function Fade({
  progress,
  range,
  startVisible = false,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  startVisible?: boolean;
  children: ReactNode;
}) {
  const [s, e] = range;
  const opacity = useTransform(
    progress,
    startVisible ? [s, e - 0.06, e] : [s, s + 0.06, e - 0.06, e],
    startVisible ? [1, 1, 0] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [s, e], [12, -12]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-x-0 flex justify-center px-6"
    >
      {children}
    </motion.div>
  );
}

function CTA({
  progress,
  whatsapp,
}: {
  progress: MotionValue<number>;
  whatsapp: string;
}) {
  const msg = encodeURIComponent("Olá! Quero pedir o Mumu Burger 🍔");
  // Only clickable once the final beat is on screen.
  const pe = useTransform(progress, [0.79, 0.8], ["none", "auto"]);
  return (
    <motion.a
      style={{ pointerEvents: pe as unknown as MotionValue<string> }}
      href={`https://wa.me/${whatsapp}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-5 rounded-full bg-amber-brand px-8 py-3 text-sm font-semibold uppercase tracking-wide text-black transition hover:brightness-110"
    >
      Pedir no WhatsApp
    </motion.a>
  );
}

function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.08], [1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
        Scroll para explorar
      </span>
      <div className="mt-2 h-7 w-4 rounded-full border border-white/20">
        <motion.div
          animate={{ y: [2, 10, 2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mt-1 h-1.5 w-0.5 rounded-full bg-white/50"
        />
      </div>
    </motion.div>
  );
}
