"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingDown } from "lucide-react";
import { TESTIMONIALS, TESTIMONIAL_DISCLAIMER } from "@/lib/content.id";
import { trackEvent } from "@/components/ui/Analytics";

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((c) => (c + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
    trackEvent("testimonial_swipe", { direction: dir > 0 ? "next" : "prev" });
  };

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => go(1), 5000);
  };

  useEffect(() => {
    resetAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -120 : 120,
      opacity: 0,
    }),
  };

  const t = TESTIMONIALS[current];

  return (
    <section
      id="testimoni"
      className="py-10 md:py-14 bg-[var(--bg-900)] relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent-blue)] uppercase mb-3">
            Testimoni
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Kata Mereka yang Sudah Merasakan
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => {
            if (autoRef.current) clearInterval(autoRef.current);
          }}
          onMouseLeave={resetAuto}
        >
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -50) go(1);
                  if (info.offset.x > 50) go(-1);
                }}
                className="glass-card rounded-2xl p-8 md:p-12 text-center cursor-grab active:cursor-grabbing"
              >
                {/* Before → after */}
                <div className="flex items-center justify-center gap-6 mb-8">
                  <div className="text-center">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Sebelum</p>
                    <p className="text-3xl font-black text-[var(--anana-red)]">
                      {t.before}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{t.unit}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <TrendingDown className="w-8 h-8 text-[var(--accent-cyan)]" aria-hidden />
                    <div className="w-px h-8 bg-[var(--card-stroke)]" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[var(--text-muted)] mb-1">Sesudah</p>
                    <p className="text-3xl font-black text-[var(--accent-cyan)]">
                      {t.after}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">{t.unit}</p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-muted)] mb-1">{t.type}</p>
                {t.detail && (
                  <p className="text-xs text-[var(--text-muted)] mb-6">{t.detail}</p>
                )}

                <p className="font-bold text-lg">
                  {t.name}
                  {t.age && (
                    <span className="text-[var(--text-muted)] font-normal text-sm ml-1">
                      ({t.age} tahun)
                    </span>
                  )}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Dots + nav in one row */}
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={() => { go(-1); resetAuto(); }}
            aria-label="Testimoni sebelumnya"
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:border-[var(--accent-blue)] transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden />
          </button>

          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Pilih testimoni"
          >
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Testimoni ${i + 1}`}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); resetAuto(); }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current
                  ? "bg-[var(--accent-cyan)] w-6"
                  : "bg-[var(--text-muted)]/30 hover:bg-[var(--text-muted)]/60"
              }`}
            />
          ))}
          </div>

          <button
            onClick={() => { go(1); resetAuto(); }}
            aria-label="Testimoni berikutnya"
            className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:border-[var(--accent-blue)] transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4" aria-hidden />
          </button>
        </div>

        {/* §14 Mandatory disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 p-4 rounded-xl border border-[var(--text-muted)]/20 bg-[var(--bg-800)]/50"
        >
          <p className="text-xs text-[var(--text-muted)] text-center leading-relaxed">
            ⚠️ {TESTIMONIAL_DISCLAIMER}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
