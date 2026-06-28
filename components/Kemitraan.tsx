"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  MessageCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { KEMITRAAN } from "@/lib/content.id";
import { WA_MITRA, waLink } from "@/lib/config";
import { trackEvent } from "@/components/ui/Analytics";

const PROP_ICONS: Record<string, React.ElementType> = {
  "trending-up": TrendingUp,
  "shield-check": ShieldCheck,
  "book-open": BookOpen,
  "refresh-cw": RefreshCw,
};

interface FormState {
  nama: string;
  whatsapp: string;
  kota: string;
  estimasi: string;
  pesan: string;
}

const EMPTY: FormState = {
  nama: "",
  whatsapp: "",
  kota: "",
  estimasi: "",
  pesan: "",
};

export function Kemitraan() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.nama.trim()) e.nama = "Nama wajib diisi";
    if (!form.whatsapp.trim()) e.whatsapp = "No. WhatsApp wajib diisi";
    if (!form.kota.trim()) e.kota = "Kota/Wilayah wajib diisi";
    if (!form.estimasi.trim()) e.estimasi = "Estimasi kebutuhan wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const msg = [
      WA_MITRA,
      `\n\nNama: ${form.nama}`,
      `No. WhatsApp: ${form.whatsapp}`,
      `Kota/Wilayah: ${form.kota}`,
      `Estimasi Kebutuhan: ${form.estimasi}`,
      form.pesan ? `\nPesan: ${form.pesan}` : "",
    ].join("");

    trackEvent("kemitraan_click", { source: "form" });
    window.open(waLink(msg), "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="kemitraan"
      className="py-10 md:py-14 bg-[var(--bg-900)] relative overflow-hidden"
    >
      {/* Red glow background */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-5 pointer-events-none"
        aria-hidden
        style={{
          background: "radial-gradient(ellipse, var(--anana-red), transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[var(--anana-red)]/10 border border-[var(--anana-red)]/30">
            <Users className="w-4 h-4 text-[var(--anana-red)]" aria-hidden />
            <span className="text-xs font-bold text-[var(--anana-red)] tracking-wider uppercase">
              Kemitraan
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {KEMITRAAN.headline}
          </h2>
          <p className="text-[var(--text-muted)] text-lg max-w-xl mx-auto">
            {KEMITRAAN.pitch}
          </p>
        </motion.div>

        {/* Value props */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {KEMITRAAN.valueProps.map((prop, i) => {
            const Icon = PROP_ICONS[prop.icon] ?? TrendingUp;
            return (
              <motion.div
                key={prop.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--anana-red)]/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--anana-red)]" aria-hidden />
                </div>
                <h3 className="font-bold text-sm">{prop.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {prop.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-center text-xl font-extrabold mb-8">
            Cara Bergabung
          </h3>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-8 left-[calc(100%/6)] right-[calc(100%/6)] h-px"
              aria-hidden
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--accent-blue), transparent)",
              }}
            />

            {KEMITRAAN.steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center gap-3 relative z-10">
                <div className="w-16 h-16 rounded-full glass-card border-2 border-[var(--accent-blue)] flex items-center justify-center shadow-glow-sm">
                  <span className="text-2xl font-black text-[var(--accent-blue)]">
                    {step.num}
                  </span>
                </div>
                <h4 className="font-bold">{step.label}</h4>
                <p className="text-xs text-[var(--text-muted)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 md:p-10"
        >
          <h3 className="text-xl font-extrabold mb-2 text-center">
            Formulir Konsultasi Kemitraan
          </h3>
          <p className="text-[var(--text-muted)] text-sm text-center mb-8">
            Isi form ini — kami akan langsung hubungi kamu via WhatsApp.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Nama */}
            <Field
              label="Nama Lengkap *"
              id="nama"
              value={form.nama}
              error={errors.nama}
              onChange={(v) => setForm((f) => ({ ...f, nama: v }))}
              placeholder="Nama kamu"
            />

            {/* WhatsApp */}
            <Field
              label="Nomor WhatsApp *"
              id="whatsapp"
              type="tel"
              value={form.whatsapp}
              error={errors.whatsapp}
              onChange={(v) => setForm((f) => ({ ...f, whatsapp: v }))}
              placeholder="08xx-xxxx-xxxx"
            />

            {/* Kota */}
            <Field
              label="Kota / Wilayah *"
              id="kota"
              value={form.kota}
              error={errors.kota}
              onChange={(v) => setForm((f) => ({ ...f, kota: v }))}
              placeholder="Contoh: Malang, Jawa Timur"
            />

            {/* Estimasi */}
            <Field
              label="Estimasi Kebutuhan per Bulan *"
              id="estimasi"
              value={form.estimasi}
              error={errors.estimasi}
              onChange={(v) => setForm((f) => ({ ...f, estimasi: v }))}
              placeholder="Contoh: 50 botol, 5 karton"
            />

            {/* Pesan opsional */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pesan"
                className="text-sm font-semibold text-[var(--text-muted)]"
              >
                Pesan (opsional)
              </label>
              <textarea
                id="pesan"
                rows={3}
                value={form.pesan}
                onChange={(e) => setForm((f) => ({ ...f, pesan: e.target.value }))}
                placeholder="Ada pertanyaan khusus?"
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-800)] border border-[var(--card-stroke)] text-sm text-white placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-blue)] resize-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="red"
                size="md"
                className="w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" aria-hidden />
                Konsultasi Kemitraan via WA
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  type = "text",
  value,
  error,
  onChange,
  placeholder,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-[var(--text-muted)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-800)] border text-sm text-white placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-blue)] transition-colors ${
          error
            ? "border-[var(--anana-red)]"
            : "border-[var(--card-stroke)]"
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-[var(--anana-red)] mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}
