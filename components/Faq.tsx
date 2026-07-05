"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { FAQ } from "@/lib/content.id";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 bg-[var(--bg-900)]">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-[var(--accent-blue)] uppercase mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold">
            Pertanyaan yang Sering Diajukan
          </h2>
        </motion.div>

        {/* Accordion cards */}
        <dl className="flex flex-col gap-3">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid var(--card-stroke)" }}
              >
                {/* Question header */}
                <dt>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-center transition-colors duration-200"
                    style={{
                      background: isOpen
                        ? "linear-gradient(135deg, rgba(45,156,255,0.25) 0%, rgba(25,200,255,0.18) 100%)"
                        : "rgba(45,156,255,0.10)",
                    }}
                  >
                    {/* Spacer to balance the icon */}
                    <span className="w-7 shrink-0" />

                    <span className="flex-1 text-sm md:text-base font-semibold text-center leading-snug text-white">
                      {item.q}
                    </span>

                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
                      style={{
                        background: isOpen
                          ? "var(--accent-blue)"
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-white/70" />
                      )}
                    </span>
                  </button>
                </dt>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-6 py-5 text-sm leading-relaxed"
                        style={{
                          color: "var(--text-muted)",
                          background: "rgba(255,255,255,0.02)",
                          borderTop: "1px solid var(--card-stroke)",
                        }}
                      >
                        {item.a}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
