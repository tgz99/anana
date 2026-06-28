"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Users, X, Plus } from "lucide-react";
import { WA_ORDER, WA_MITRA, waLink } from "@/lib/config";
import { trackEvent } from "@/components/ui/Analytics";

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [hideOnFooter, setHideOnFooter] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("hubungi");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHideOnFooter(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (hideOnFooter) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      aria-label="Kontak cepat"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2 items-end"
          >
            {/* Pesan */}
            <a
              href={waLink(WA_ORDER)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackEvent("wa_click", { source: "floating" });
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-glow-sm text-sm font-semibold text-white"
              style={{ background: "var(--accent-blue)" }}
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
              Pesan Sekarang
            </a>

            {/* Jadi Reseller */}
            <a
              href="#kemitraan"
              onClick={() => {
                trackEvent("kemitraan_click", { source: "floating" });
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-glow-red text-sm font-semibold text-white"
              style={{ background: "var(--anana-red)" }}
            >
              <Users className="w-4 h-4 flex-shrink-0" aria-hidden />
              Jadi Reseller
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB toggle */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup menu kontak" : "Buka menu kontak"}
        aria-expanded={open}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-glow text-white animate-pulse-glow"
        style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))" }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6" aria-hidden />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Plus className="w-6 h-6" aria-hidden />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
