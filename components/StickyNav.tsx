"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, Users } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { WA_ORDER, waLink } from "@/lib/config";
import { trackEvent } from "@/components/ui/Analytics";

const NAV_LINKS = [
  { label: "Tentang", href: "#awareness" },
  { label: "Nano Oxy Bubble™", href: "#nano-bubble" },
  { label: "Manfaat", href: "#manfaat" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "Kemitraan", href: "#kemitraan" },
  { label: "Hubungi", href: "#hubungi" },
];

export function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) { setVisible(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            background: "rgba(3, 6, 15, 0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--card-stroke)",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="#hero" className="text-2xl font-black text-[var(--anana-red)] flex-shrink-0">
              anana
            </a>

            {/* Desktop nav links */}
            <nav
              className="hidden lg:flex items-center gap-6"
              aria-label="Navigasi utama"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <ThemeToggle />
              <Button
                as="a"
                href={waLink(WA_ORDER)}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => trackEvent("wa_click", { source: "sticky_nav" })}
              >
                <MessageCircle className="w-4 h-4" aria-hidden />
                Pesan
              </Button>
              <Button
                as="a"
                href="#kemitraan"
                variant="red"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={() => trackEvent("kemitraan_click", { source: "sticky_nav" })}
              >
                <Users className="w-4 h-4" aria-hidden />
                Jadi Reseller
              </Button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="lg:hidden p-2 text-[var(--text-muted)] hover:text-white"
                aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                aria-label="Menu mobile"
                className="lg:hidden overflow-hidden border-t border-[var(--card-stroke)]"
                style={{ background: "rgba(3, 6, 15, 0.95)" }}
              >
                <div className="flex flex-col px-4 py-4 gap-3">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-sm text-[var(--text-muted)] hover:text-white py-2 border-b border-[var(--card-stroke)] last:border-0 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <Button
                      as="a"
                      href={waLink(WA_ORDER)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      size="sm"
                      className="flex-1 justify-center"
                      onClick={() => trackEvent("wa_click", { source: "sticky_nav_mobile" })}
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden />
                      Pesan
                    </Button>
                    <Button
                      as="a"
                      href="#kemitraan"
                      variant="red"
                      size="sm"
                      className="flex-1 justify-center"
                      onClick={() => { setMenuOpen(false); trackEvent("kemitraan_click", { source: "sticky_nav_mobile" }); }}
                    >
                      <Users className="w-4 h-4" aria-hidden />
                      Jadi Reseller
                    </Button>
                  </div>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
