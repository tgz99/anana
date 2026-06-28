"use client";

import { motion } from "framer-motion";
import { Cigarette, Wind, Dna, ChevronRight } from "lucide-react";
import { AWARENESS } from "@/lib/content.id";

const CAUSE_ICONS: Record<string, React.ElementType> = {
  cigarette: Cigarette,
  wind: Wind,
  dna: Dna,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Awareness() {
  return (
    <section
      id="awareness"
      className="py-10 md:py-14 bg-[var(--bg-900)] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10 pointer-events-none"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse, var(--accent-blue), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Section intro */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="text-center mb-8"
        >
          <motion.p
            variants={itemVariants}
            className="text-xs font-bold tracking-[0.3em] text-[var(--accent-blue)] uppercase mb-3"
          >
            Tentang Oksigen
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-extrabold mb-4"
          >
            {AWARENESS.oxygenImportance}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg leading-relaxed"
          >
            {AWARENESS.oxygenDetail}
          </motion.p>
        </motion.div>

        {/* Cause tiles */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {AWARENESS.causes.map((cause) => {
            const Icon = CAUSE_ICONS[cause.icon] ?? Wind;
            return (
              <motion.div
                key={cause.label}
                variants={itemVariants}
                className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-[var(--accent-blue)] transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-[var(--bg-700)] flex items-center justify-center shadow-glow-sm">
                  <Icon
                    className="w-7 h-7 text-[var(--accent-cyan)]"
                    aria-hidden
                  />
                </div>
                <p className="font-semibold text-sm leading-snug">
                  {cause.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Section CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <a
            href="#hipoksia"
            className="inline-flex items-center gap-2 text-[var(--accent-blue)] font-semibold hover:underline focus-visible:outline-[var(--accent-blue)]"
          >
            Kenali Risikonya
            <ChevronRight className="w-4 h-4" aria-hidden />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
