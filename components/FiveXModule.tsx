"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/ui/CountUp";
import { FIVEX } from "@/lib/content.id";

export function FiveXModule() {
  return (
    <section
      id="5x-oksigen"
      className="py-10 md:py-14 bg-[var(--bg-900)] relative overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(45,156,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent-blue)] uppercase mb-4">
            Kandungan Oksigen
          </p>

          {/* Big 5x count-up */}
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <CountUp
              to={5}
              duration={1800}
              suffix="X"
              className="text-[96px] md:text-[140px] font-black leading-none text-glow text-[var(--accent-cyan)]"
            />
            <span className="text-2xl md:text-4xl font-extrabold text-[var(--text-muted)]">
              Lebih Banyak O₂*
            </span>
          </div>

          <p className="text-[var(--text-muted)] text-lg">
            {FIVEX.sub}
          </p>
        </motion.div>

        {/* Comparison bars */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl p-8 max-w-lg mx-auto mb-8"
        >
          {/* Air mineral biasa */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--text-muted)]">Air Mineral Biasa</span>
              <span className="text-[var(--text-muted)] font-bold">1x</span>
            </div>
            <div className="h-3 bg-[var(--bg-700)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "20%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-full bg-[var(--text-muted)]/40 rounded-full"
              />
            </div>
          </div>

          {/* anana */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white font-semibold">
                anana <span className="text-[var(--accent-cyan)]">Super Oksigen</span>
              </span>
              <span className="text-[var(--accent-cyan)] font-bold">5x</span>
            </div>
            <div className="h-3 bg-[var(--bg-700)] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--accent-blue), var(--accent-cyan))",
                  boxShadow: "0 0 12px rgba(25,200,255,0.4)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Footnote */}
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
          {FIVEX.footnote}
        </p>
      </div>
    </section>
  );
}
