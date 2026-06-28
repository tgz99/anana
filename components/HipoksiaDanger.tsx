"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Brain,
  Activity,
  Heart,
  Wind,
  Filter,
} from "lucide-react";
import { HIPOKSIA } from "@/lib/content.id";

const RISK_ICONS: Record<string, React.ElementType> = {
  droplets: Droplets,
  brain: Brain,
  activity: Activity,
  heart: Heart,
  wind: Wind,
  filter: Filter,
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

export function HipoksiaDanger() {
  return (
    <section
      id="hipoksia"
      className="py-10 md:py-14 relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, var(--bg-900) 0%, var(--bg-800) 100%)",
      }}
    >
      {/* Red accent glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-5 pointer-events-none"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse, #E11B22, transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--anana-red)] uppercase mb-3">
            Waspada
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
            {HIPOKSIA.title}
          </h2>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
            {HIPOKSIA.definition}
          </p>
        </motion.div>

        {/* Risk icons — staggered reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
          role="list"
          aria-label="Risiko hipoksia"
        >
          {HIPOKSIA.risks.map((risk) => {
            const Icon = RISK_ICONS[risk.icon] ?? Activity;
            return (
              <motion.div
                key={risk.label}
                variants={itemVariants}
                role="listitem"
                className="glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:border-[var(--anana-red)]/60 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--anana-red)]/10 flex items-center justify-center group-hover:bg-[var(--anana-red)]/20 transition-colors">
                  <Icon
                    className="w-6 h-6 text-[var(--anana-red)]"
                    aria-hidden
                  />
                </div>
                <p className="text-xs font-semibold leading-tight">
                  {risk.label}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
