"use client";

import { motion } from "framer-motion";
import { ExternalLink, Flag } from "lucide-react";
import { DistributorBadge } from "@/components/ui/DistributorBadge";
import { BRAND } from "@/lib/content.id";
import { PRINCIPAL } from "@/lib/config";

export function Credibility() {
  return (
    <section
      id="kredibilitas"
      className="py-10 md:py-14 bg-[var(--bg-800)] relative overflow-hidden"
    >
      {/* Indonesian flag-color subtle stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        aria-hidden
        style={{
          background: "linear-gradient(90deg, #E11B22 50%, #FFFFFF 50%)",
          opacity: 0.4,
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
          <div className="inline-flex items-center gap-2 mb-4">
            <Flag className="w-5 h-5 text-[var(--anana-red)]" aria-hidden />
            <p className="text-xs font-bold tracking-[0.3em] text-[var(--anana-red)] uppercase">
              {BRAND.prideMark}
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            {BRAND.originClaim}
          </h2>
          <p className="text-lg font-bold text-[var(--accent-cyan)] mb-6">
            {BRAND.originClaim2}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <DistributorBadge />
            <span className="text-[var(--text-muted)] text-sm">
              Produk oleh:{" "}
              <span className="text-white font-semibold">{PRINCIPAL.entity}</span>
            </span>
          </div>
        </motion.div>

        {/* Info card */}
        <div className="flex justify-center">
          <motion.a
            href={PRINCIPAL.site}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-6 flex flex-col gap-3 hover:border-[var(--accent-blue)] transition-colors group max-w-sm w-full"
          >
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-blue)]/10 flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-[var(--accent-blue)]" aria-hidden />
            </div>
            <h3 className="font-bold text-sm">Situs Resmi Produsen</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Informasi lengkap tentang anana Super Oksigen dari produsen.
            </p>
            <span className="text-xs text-[var(--accent-blue)] group-hover:underline flex items-center gap-1 mt-auto">
              Kunjungi anana.nanooxywater.com
              <ExternalLink className="w-3 h-3" aria-hidden />
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
