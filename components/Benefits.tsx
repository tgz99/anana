"use client";

import { motion } from "framer-motion";
import { Atom, Shield, Brain, Zap, Droplets } from "lucide-react";
import { BENEFITS } from "@/lib/content.id";

const BENEFIT_ICONS: Record<string, React.ElementType> = {
  atom: Atom,
  shield: Shield,
  brain: Brain,
  zap: Zap,
  droplets: Droplets,
};

const QUICK_CHIPS = [
  "Metabolisme",
  "Imun & Daya Tahan",
  "Bantu Kontrol Gula Darah",
  "Antioksidan",
  "Turunkan Asam Laktat",
  "Anti Degeneratif",
];

export function Benefits() {
  return (
    <section
      id="manfaat"
      className="py-10 md:py-14 bg-[var(--bg-800)] relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent-blue)] uppercase mb-3">
            Manfaat Utama
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Manfaat yang Dirasakan
          </h2>
        </motion.div>

        {/* Alternating benefit blocks */}
        <div className="flex flex-col gap-8 mb-8">
          {BENEFITS.map((benefit, i) => {
            const Icon = BENEFIT_ICONS[benefit.icon] ?? Atom;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={benefit.tag}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
              >
                {/* Icon side */}
                <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-3xl glass-card flex items-center justify-center shadow-glow-sm">
                  <Icon
                    className="w-10 h-10 md:w-12 md:h-12 text-[var(--accent-cyan)]"
                    aria-hidden
                  />
                </div>

                {/* Text side */}
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block text-[10px] font-bold tracking-[0.25em] text-[var(--accent-blue)] uppercase mb-2 px-2 py-1 rounded border border-[var(--accent-blue)]/30 bg-[var(--accent-blue)]/5">
                    {benefit.tag}
                  </span>
                  <h3 className="text-xl md:text-2xl font-extrabold mb-3 mt-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {benefit.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick benefit chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {QUICK_CHIPS.map((chip) => (
            <span
              key={chip}
              className="px-4 py-2 rounded-full text-sm font-semibold glass-card border-[var(--accent-blue)]/30 text-[var(--accent-cyan)]"
            >
              {chip}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
