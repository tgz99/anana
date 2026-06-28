"use client";

import { motion } from "framer-motion";
import { Atom, Zap, Flag, Layers, Droplets, Brain } from "lucide-react";
import { FEATURE_CARDS, LIFESTYLE } from "@/lib/content.id";

const ICON_MAP: Record<string, React.ElementType> = {
  atom: Atom,
  zap: Zap,
  flag: Flag,
  layers: Layers,
  droplets: Droplets,
  brain: Brain,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeatureGrid() {
  return (
    <section
      id="fitur"
      className="py-10 md:py-14 bg-[var(--bg-900)] relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent-blue)] uppercase mb-3">
            Keunggulan
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Kenapa anana Super Oksigen?
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10"
        >
          {FEATURE_CARDS.map((card) => {
            const Icon = ICON_MAP[card.icon] ?? Atom;
            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4 hover:border-[var(--accent-blue)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-blue)]/10 flex items-center justify-center group-hover:bg-[var(--accent-blue)]/20 transition-colors">
                  <Icon
                    className="w-6 h-6 text-[var(--accent-blue)]"
                    aria-hidden
                  />
                </div>
                <h3 className="text-sm font-extrabold tracking-wide leading-tight">
                  {card.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {card.body}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Lifestyle row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-center text-xl md:text-2xl font-extrabold mb-8 tracking-wide">
            {LIFESTYLE.headline}
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            {LIFESTYLE.items.map((item, i) => {
              const Icon = ICON_MAP[item.icon] ?? Atom;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="flex flex-col items-center gap-3 glass-card rounded-2xl px-6 py-5 min-w-[120px]"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-cyan)]/10 flex items-center justify-center">
                    <Icon
                      className="w-5 h-5 text-[var(--accent-cyan)]"
                      aria-hidden
                    />
                  </div>
                  <span className="text-xs font-bold tracking-wider text-center leading-tight">
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
