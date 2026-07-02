---
name: add-landing-section
description: Scaffold a new landing-page section for the anana site with correct conventions — content in content.id.ts, CSS-var theming, Framer Motion reveal, analytics-wired CTAs, and placement in app/page.tsx. Use when asked to "add a section", "buatkan section baru", "tambah bagian" to the landing page.
---

# Add Landing Section — anana Super Oksigen

Skill langkah-demi-langkah untuk menambah section baru yang konsisten dengan repo.
Untuk pekerjaan besar/berjudgment, delegasikan ke agent `anana-section-builder`. Skill ini
adalah checklist + template agar tidak ada langkah yang terlewat.

## Sebelum menulis

1. **Baca pola dulu.** Buka 2 section serupa untuk meniru struktur & animasi, mis.
   [components/Benefits.tsx](../../../components/Benefits.tsx),
   [components/HipoksiaDanger.tsx](../../../components/HipoksiaDanger.tsx),
   [components/Kemitraan.tsx](../../../components/Kemitraan.tsx).
2. **Klarifikasi** dengan user (jika belum jelas): posisi di halaman, apakah punya CTA
   (WA/reseller?), statis atau interaktif, teks kontennya.
3. **Kepatuhan:** klaim produk apa pun harus lolos aturan medis (PRD §7). Copy §3 milik
   prinsipal tidak diedit tanpa sign-off.

## Langkah

### 1) Tambah konten ke `lib/content.id.ts`
Semua teks jadi konstanta bernama, jangan hardcode di JSX:
```ts
export const NAMA_SECTION = {
  eyebrow: "LABEL KECIL",
  headline: "Judul Section",
  body: "Deskripsi...",
  items: [ /* ... */ ],
};
```

### 2) Buat `components/NamaSection.tsx`
Template section statis (RSC). Tambah `"use client"` HANYA jika ada state/effect/onClick.

```tsx
import { NAMA_SECTION } from "@/lib/content.id";
// jika ada CTA:
// "use client";  ← baris pertama
// import { trackEvent } from "@/components/ui/Analytics";
// import { WA_ORDER, waLink } from "@/lib/config";

export function NamaSection() {
  return (
    <section id="nama-section" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3"
           style={{ color: "var(--accent-blue)" }}>
          {NAMA_SECTION.eyebrow}
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold">
          {NAMA_SECTION.headline}
        </h2>
        {/* konten */}
      </div>
    </section>
  );
}
```

**Wajib:**
- Warna via CSS var (`var(--accent-blue)`, `var(--bg-800)`, `var(--anana-red)`,
  `var(--text-muted)`) — bukan hex mentah.
- Reveal Framer Motion mengikuti pola section lain (jika section client):
  `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}`.
- Ikon dari `lucide-react`, `aria-hidden` bila dekoratif.

### 3) Wiring CTA analytics (jika ada tombol)
```tsx
<a href={waLink(WA_ORDER)} target="_blank" rel="noopener noreferrer"
   onClick={() => trackEvent("wa_click", { source: "nama_section" })}>
  Pesan Sekarang
</a>
// CTA reseller → trackEvent("kemitraan_click", { source: "nama_section" })
```
Gunakan nama event dari taksonomi PRD §5; `source` deskriptif & unik.

### 4) Pasang di `app/page.tsx`
Impor dan sisipkan `<NamaSection />` pada urutan yang diminta di dalam `<main>`.
Jika ini section funnel yang ingin dilacak masuk-viewport, tambahkan di daftar tracker:
```tsx
<SectionTracker sectionId="nama-section" source="nama_section" />
```
dan tambahkan `source` baru itu ke dokumentasi taksonomi (PRD §5).

### 5) Verifikasi
- `npm run build` → WAJIB lolos.
- Cek visual light & dark mode + mobile (pakai `/deploy-anana` lalu `/browse` bila ada).

## Definisi selesai
Build lolos · konten di `content.id.ts` · tema via CSS var (light/dark OK) · responsif ·
CTA (jika ada) memancarkan event yang benar · terpasang di `page.tsx` · patuh aturan klaim.
