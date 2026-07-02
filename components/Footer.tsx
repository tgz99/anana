"use client";

import { Instagram, Music2, MessageCircle, ExternalLink } from "lucide-react";
import { DistributorBadge } from "@/components/ui/DistributorBadge";
import { BRAND, TESTIMONIAL_DISCLAIMER } from "@/lib/content.id";
import { WA_ORDER, waLink, SOCIALS, PRINCIPAL, DISTRIBUTOR, TERRITORY } from "@/lib/config";
import { trackEvent } from "@/components/ui/Analytics";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="hubungi"
      className="bg-[var(--bg-900)] border-t border-[var(--card-stroke)] pt-10 pb-6"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand col */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-4xl font-black text-[var(--anana-red)]">anana</p>
              <p className="text-xs font-bold text-[var(--accent-cyan)] tracking-widest uppercase">
                {BRAND.badge}
              </p>
            </div>
            <DistributorBadge />
            <div className="flex flex-col gap-1">
              <p className="text-xs text-white font-semibold">{DISTRIBUTOR.entity}</p>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {DISTRIBUTOR.role} · <span className="text-white">{TERRITORY}</span>
              </p>
              <p className="text-[10px] text-[var(--text-muted)]">
                No. Reg: <span className="text-[var(--accent-blue)] font-mono">{DISTRIBUTOR.regNumber}</span>
              </p>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Produsen: <span className="text-white">{PRINCIPAL.entity}</span>
              <br />
              <a
                href={PRINCIPAL.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] hover:underline inline-flex items-center gap-1"
              >
                anana.nanooxywater.com
                <ExternalLink className="w-3 h-3" aria-hidden />
              </a>
            </p>
          </div>

          {/* Contact col */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-[var(--text-muted)]">
              Hubungi Kami
            </h3>
            <a
              href={waLink(WA_ORDER)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("wa_click", { source: "footer" })}
              className="inline-flex items-center gap-3 text-white font-semibold hover:text-[var(--accent-cyan)] transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-green-400" aria-hidden />
              0811-236-726
            </a>

            <div className="flex gap-4 mt-2">
              <a
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram distributor anana"
                className="text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={SOCIALS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok distributor anana"
                className="text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors"
              >
                <Music2 className="w-6 h-6" />
              </a>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              @anana.superoksigen_distributor
            </p>

            {/* QR code */}
            <div className="mt-2 flex flex-col gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/assets/qrcode-wa.png`}
                alt="Scan QR untuk WhatsApp"
                className="w-24 h-24 rounded-xl border border-[var(--card-stroke)]"
              />
              <p className="text-[9px] text-[var(--text-muted)]">
                Scan untuk WhatsApp
              </p>
            </div>
          </div>

          {/* Nav col */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-extrabold tracking-wider uppercase text-[var(--text-muted)]">
              Navigasi
            </h3>
            {[
              { label: "Tentang", href: "#awareness" },
              { label: "Nano Oxy Bubble™", href: "#nano-bubble" },
              { label: "Manfaat", href: "#manfaat" },
              { label: "Testimoni", href: "#testimoni" },
              { label: "Kemitraan", href: "#kemitraan" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[var(--text-muted)] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--card-stroke)] pt-6 flex flex-col gap-3">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-2xl">
            ⚠️ {TESTIMONIAL_DISCLAIMER}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
            <p>© {year} {DISTRIBUTOR.entity} — Brand Owner &amp; Master Distributor anana Super Oksigen. Semua hak dilindungi.</p>
            <p>
              Produk oleh{" "}
              <a
                href={PRINCIPAL.site}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] hover:underline"
              >
                {PRINCIPAL.entity}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
