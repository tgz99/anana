"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Atom } from "lucide-react";
import { NANO_BUBBLE } from "@/lib/content.id";

export function NanoBubbleExplainer() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bubbleScale = useTransform(scrollYProgress, [0.15, 0.5], [0.3, 1]);
  const bubbleX = useTransform(scrollYProgress, [0.15, 0.55], [-56, 0]);
  const cellOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <section
      id="nano-bubble"
      ref={sectionRef}
      className="py-10 md:py-14 bg-[var(--bg-800)] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,156,255,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent-cyan)] uppercase mb-3">
            Teknologi
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight">
            {NANO_BUBBLE.solutionTitle}
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {NANO_BUBBLE.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left — cell animation + label stacked in flow */}
          <div className="flex flex-col items-center gap-6">
            {/* Cell membrane circle */}
            <div className="relative w-52 h-52 rounded-full border-4 border-[var(--accent-blue)]/40 flex items-center justify-center overflow-hidden flex-shrink-0">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(45,156,255,0.15), transparent 80%)",
                  opacity: cellOpacity,
                }}
              />
              <div className="text-center z-10 pointer-events-none select-none">
                <p className="text-xs text-[var(--text-muted)] font-medium">Sel Tubuh</p>
                <Atom
                  className="w-10 h-10 mx-auto text-[var(--accent-blue)]/60 mt-2"
                  aria-hidden
                />
              </div>
              {/* Animated nano bubble */}
              <motion.div
                className="absolute w-8 h-8 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(25,200,255,0.9), rgba(45,156,255,0.4))",
                  boxShadow: "0 0 16px rgba(25,200,255,0.6)",
                  scale: bubbleScale,
                  x: bubbleX,
                }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">
                  O₂
                </span>
              </motion.div>
            </div>

            {/* Size label — in flow, never overlaps circle */}
            <div className="text-center">
              <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">
                Partikel Nano Oxy Bubble™
              </p>
              <p className="text-2xl font-black text-[var(--accent-cyan)]">
                {NANO_BUBBLE.sizeRange}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">
                {NANO_BUBBLE.caption}
              </p>
            </div>
          </div>

          {/* Right — comparison cards */}
          <div className="flex flex-col gap-4">
            {/* Normal water */}
            <div className="glass-card rounded-2xl p-5 border-l-4 border-[var(--text-muted)]/30">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">
                {NANO_BUBBLE.compareNormal.label}
              </p>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--text-muted)]/20 flex-shrink-0" />
                <div className="flex-1 h-2 bg-[var(--bg-700)] rounded-full overflow-hidden">
                  <div className="h-full w-1/5 bg-[var(--text-muted)]/40 rounded-full" />
                </div>
                <span className="text-xs font-bold text-[var(--text-muted)] w-5 text-right">1x</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {NANO_BUBBLE.compareNormal.desc}
              </p>
            </div>

            {/* anana */}
            <div className="glass-card rounded-2xl p-5 border-l-4 border-[var(--accent-cyan)] shadow-glow-sm">
              <p className="text-xs text-[var(--accent-cyan)] uppercase tracking-wider mb-3 font-bold">
                {NANO_BUBBLE.compareAnana.label}
              </p>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-5 rounded-full bg-[var(--accent-cyan)]/20 flex-shrink-0 shadow-[0_0_8px_rgba(25,200,255,0.4)]" />
                <div className="flex-1 h-2 bg-[var(--bg-700)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))",
                      boxShadow: "0 0 8px rgba(25,200,255,0.5)",
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-[var(--accent-cyan)] w-5 text-right">5x</span>
              </div>
              <p className="text-xs text-[var(--accent-cyan)]/80">
                {NANO_BUBBLE.compareAnana.desc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
