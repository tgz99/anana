"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DistributorBadge } from "@/components/ui/DistributorBadge";
import { BubbleField } from "@/components/ui/BubbleField";
import { BRAND } from "@/lib/content.id";
import { WA_ORDER, waLink } from "@/lib/config";
import { trackEvent } from "@/components/ui/Analytics";

// Bubble particle canvas — lazy-loaded, no impact on FCP
const BubbleCanvas = dynamic(
  () => import("@/components/three/BubbleCanvas").then((m) => ({ default: m.BubbleCanvas })),
  { ssr: false }
);

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-900)]"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(16,42,102,0.7) 0%, transparent 80%)",
        }}
      />

      <BubbleField count={16} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center gap-4 md:gap-6">

        {/* Principal credit + distributor badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-xs text-[var(--text-muted)] tracking-wider uppercase">
            {BRAND.poweredBy}
          </span>
          <span className="text-[var(--card-stroke)]">·</span>
          <DistributorBadge />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center gap-1"
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
            <span className="text-[var(--anana-red)]">anana</span>
          </h1>
          <p className="text-sm md:text-base font-bold tracking-[0.3em] text-[var(--accent-cyan)] uppercase">
            {BRAND.badge}
          </p>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="max-w-2xl"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-glow">
            {BRAND.headline}
          </h2>
        </motion.div>

        {/* Bottle + bubble particles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative w-full"
          style={{ height: "520px" }}
        >
          {/* Blue halo */}
          <div
            className="absolute inset-0 -z-10 blur-3xl pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 55% 75% at 50% 55%, rgba(45,156,255,0.28) 0%, transparent 70%)",
            }}
          />

          {/* WebGL bubble particles — fills the container, transparent background */}
          <div className="absolute inset-0">
            <BubbleCanvas />
          </div>

          {/* PNG bottle centered on top of the bubble canvas */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/bottle.png"
              alt="Botol anana Super Oksigen"
              className="h-[403px] md:h-[518px] w-auto animate-float"
            />
          </div>
        </motion.div>

        {/* Stat callouts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          <div className="glass-card rounded-2xl px-4 py-2 shadow-glow-sm text-center">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Oksigen Terlarut
            </p>
            <p className="text-xl font-black text-[var(--accent-cyan)]">O₂</p>
          </div>
          <div className="w-px h-8 bg-[var(--card-stroke)]" />
          <div className="glass-card rounded-2xl px-4 py-2 shadow-glow-sm text-center">
            <p className="text-xl font-black text-[var(--accent-blue)]">5X</p>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Lebih Banyak O₂*
            </p>
          </div>
        </motion.div>

        {/* CTAs — size="md" (~30% smaller than the previous size="lg") */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm sm:max-w-none justify-center"
        >
          <Button
            as="a"
            href={waLink(WA_ORDER)}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="sm"
            className="!px-3.5 !py-2 !text-sm gap-1"
            onClick={() => trackEvent("wa_click", { source: "hero" })}
          >
            <MessageCircle className="w-3 h-3" aria-hidden />
            Pesan via WhatsApp
          </Button>
          <Button
            as="a"
            href="#kemitraan"
            variant="red"
            size="sm"
            className="!px-3.5 !py-2 !text-sm gap-1"
            onClick={() => trackEvent("kemitraan_click", { source: "hero" })}
          >
            <Users className="w-3 h-3" aria-hidden />
            Jadi Reseller
          </Button>
          <Button
            as="a"
            href="#nano-bubble"
            variant="ghost"
            size="md"
            className="text-sm"
          >
            Pelajari Teknologinya
          </Button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#awareness"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-4 text-[var(--text-muted)] hover:text-white transition-colors"
          aria-label="Scroll ke bawah"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
