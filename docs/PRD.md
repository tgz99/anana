# PRD — anana Super Oksigen Landing Page

**Status:** Live (v0.1.0) · **Owner:** PT. Hijau Sumilir Indonesia (Brand Owner & Regional Master Distributor) · **Last updated:** 2026-07-02

---

## 1. Ringkasan Produk

Landing page konversi satu-halaman untuk **anana Super Oksigen** — air minum berkadar
oksigen tinggi dengan teknologi Nano Oxy Bubble™. Halaman ini dioperasikan oleh
**PT. Hijau Sumilir Indonesia** selaku Brand Owner & Regional Master Distributor untuk wilayah
**Jakarta, Depok & Bandung** (No. Reg: `NOWI/AMDK-DIST/2026/0002`), dengan prinsipal
**PT. Nano Oxywater Internasional**.

Tujuan utama halaman: mengubah pengunjung menjadi **lead WhatsApp** — baik sebagai
pembeli (order produk) maupun sebagai calon **reseller/mitra**. Seluruh interaksi
kunci diukur lewat analytics event store internal yang divisualisasikan di dashboard.

### 1.1 Bukan tujuan (Non-goals)
- Bukan toko e-commerce. Tidak ada keranjang, checkout, atau pembayaran on-site — semua transaksi berpindah ke WhatsApp.
- Bukan aplikasi multi-halaman. Hanya ada landing (`/`) dan dashboard analytics (`/dashboard`).
- Bukan sumber klaim medis. Produk bukan obat; testimoni bersifat anekdotal (lihat §7).

---

## 2. Target Pengguna

| Persona | Kebutuhan | Konversi yang diharapkan |
|---|---|---|
| **Konsumen sehat/aktif** (Jkt/Depok/Bdg) | Air minum yang mendukung gaya hidup sehat | Klik WA "Pesan Sekarang" (`wa_click`) |
| **Calon reseller/mitra** | Peluang bisnis margin menarik dengan dukungan brand owner | Klik "Jadi Reseller" (`kemitraan_click`) |
| **Pengguna dengan kekhawatiran kesehatan** (gula darah, stamina) | Bukti sosial & edukasi | Menyelesaikan quiz → WA konsultasi |
| **Operator/Owner** (internal) | Memantau performa funnel | Membuka `/dashboard` |

---

## 3. Metrik & Tujuan Bisnis

**North Star:** jumlah lead WhatsApp berkualitas per periode (`wa_click` + `kemitraan_click` dari sesi unik).

**Funnel konversi** (didefinisikan di dashboard):
1. **Page Views** — total kunjungan (`page_view`)
2. **Unique Sessions** — sesi unik (per `sessionId`)
3. **Scroll 75%** — membaca sampai bawah (`scroll_depth_75`)
4. **Lihat Kemitraan** — sesi yang mencapai section CTA (`section_view` source=`kemitraan`)
5. **Konversi** — sesi yang klik `wa_click` atau `kemitraan_click`

**Overall conversion rate** = `(wa_click + kemitraan_click) / page_view`.

> ⚠️ **Catatan konsistensi metrik (known quirk):** Beberapa langkah funnel menghitung
> **event** (`Page Views`, `Scroll 75%`) sementara yang lain menghitung **sesi unik**
> (`Unique Sessions`, `Lihat Kemitraan`, `Konversi`). Ini membuat perbandingan
> antar-langkah tidak apple-to-apple. Lihat backlog §9 untuk normalisasi.

---

## 4. Ruang Lingkup Fungsional

### 4.1 Landing Page (`/`)
Urutan section (lihat [app/page.tsx](../app/page.tsx)):

| # | Section | Komponen | Peran |
|---|---|---|---|
| 1 | Hero | `Hero` | Headline, CTA utama WA + reseller |
| 2 | Awareness | `Awareness` | Kenapa oksigen penting |
| 3 | Bahaya Hipoksia | `HipoksiaDanger` | Problem agitation |
| 4 | Penjelasan Nano Bubble | `NanoBubbleExplainer` | Solusi/teknologi |
| 5 | 5X Oksigen | `FiveXModule` | Diferensiasi + count-up stat |
| 6 | Manfaat | `Benefits` | 5 manfaat selular |
| 7 | Feature Grid | `FeatureGrid` | 4 kartu ringkas |
| 8 | Kredibilitas | `Credibility` | Legitimasi merek/prinsipal |
| 9 | Testimoni | `Testimonials` | Bukti sosial (before/after) |
| 10 | Reseller Strip | `ResellerStrip` | Ajakan mitra |
| 11 | Kemitraan | `Kemitraan` | Detail program reseller + CTA |

Elemen persisten: `StickyNav` (atas), `FloatingWhatsApp` (FAB kanan bawah, sembunyi di footer), `Footer` (`#hubungi`), skip-link a11y, JSON-LD (Product + Organization + LocalBusiness), tema light/dark (`ThemeProvider`).

**Interaktif:**
- **EngagementQuiz** — 3 pertanyaan gaya hidup → skor risiko hipoksia (low/medium/high) → CTA WA konsultasi. Skoring: jumlah indeks jawaban; `≤2` low, `≤4` medium, else high. (Belum dirender di `page.tsx` — tersedia sebagai komponen; lihat §9.)
- **Testimonials** — swipe/carousel, tracking arah.
- **ThemeToggle** — light/dark, disimpan di `localStorage` (`anana-theme`).

### 4.2 Analytics Dashboard (`/dashboard`)
Server component (`force-dynamic`), rentang waktu: Hari Ini / 7 Hari / 30 Hari / Semua. Menampilkan metric cards, conversion rate banner, conversion funnel, tren harian 7-hari (bar), WA clicks by source, dan tabel recent events (40 terakhir). Tahan-galat: menampilkan banner error jika DB tidak tersambung.

### 4.3 Event Ingestion (`POST /api/events`)
Menerima `{ name, source?, sessionId, referrer? }`, memvalidasi `name` & `sessionId` wajib, menyimpan ke tabel `Event` bersama `ua` (dari header). Fire-and-forget dari klien.

---

## 5. Taksonomi Event (kontrak analytics)

Sumber kebenaran untuk nama event & `source`. Jangan mengubah nama tanpa memperbarui dashboard.

| Event `name` | Kapan | `source` yang mungkin |
|---|---|---|
| `page_view` | Load halaman | — |
| `scroll_depth_75` | Scroll ≥75% (sekali per sesi) | — |
| `section_view` | Section masuk viewport (≥30%) | `awareness`, `manfaat`, `testimoni`, `kemitraan` |
| `wa_click` | Klik tombol WhatsApp order | `hero`, `sticky_nav`, `sticky_nav_mobile`, `footer`, `floating`, `quiz` |
| `kemitraan_click` | Klik CTA reseller/mitra | `hero`, `sticky_nav`, `sticky_nav_mobile`, `reseller_strip`, `floating`, `form` |
| `quiz_complete` | Selesai quiz | (param `result`: low/medium/high) |
| `testimonial_swipe` | Swipe testimoni | (param `direction`: next/prev) |
| `theme_toggle` | Ganti tema | (param `from`) |

> Aturan: setiap CTA baru **wajib** memanggil `trackEvent(name, { source })` dengan `source` deskriptif. `wa_click`/`kemitraan_click` adalah event konversi — perlakukan namanya sebagai stabil.

---

## 6. Konten & Kepemilikan

Seluruh copy §3 berada di [lib/content.id.ts](../lib/content.id.ts) — **verbatim dari prinsipal**. Aturan di file: *"Do not modify without principal sign-off."* Identitas distributor & nomor kontak di [lib/config.ts](../lib/config.ts). Bahasa: Indonesia (`lang="id"`).

---

## 7. Batasan Hukum & Kepatuhan

- **Disclaimer testimoni wajib tampil** (`TESTIMONIAL_DISCLAIMER`): produk bukan obat, hasil individual dapat berbeda, anjuran konsultasi tenaga medis.
- Klaim "5X oksigen" harus selalu disertai footnote pembanding (`*dibandingkan air mineral biasa berdasarkan kadar oksigen terlarut`).
- Hindari klaim menyembuhkan/mengobati penyakit di copy baru.

---

## 8. Arsitektur & Teknologi

- **Next.js 14** (App Router, RSC), **React 18**, **TypeScript** (strict).
- **Tailwind CSS** + **Framer Motion**, ikon **lucide-react**.
- **Prisma 5** + **PostgreSQL** — event store analitik ringan (satu tabel `Event`).
- **Docker Compose** — app + Postgres; `prisma db push` otomatis saat start.
- Path alias `@/*` → root. Gambar `unoptimized` (Next config).

**Data flow konversi:**
```
User klik CTA → trackEvent(name, {source})
  ├→ window.gtag / fbq  (opsional, jika GA_ID / META_PIXEL diset)
  └→ POST /api/events → Prisma → Postgres (tabel Event)
                                     ↑
        /dashboard (RSC, force-dynamic) ── query agregat ──┘
```

---

## 9. Backlog / Roadmap

**P0 — Keamanan & kebenaran data**
- [x] Autentikasi dashboard — dashboard dipindah ke `/viewtraffic`, dilindungi
      `middleware.ts` (cookie `vt_auth`) + halaman PIN `/viewtraffic/unlock`.
      `/dashboard` lama kini redirect ke unlock.
- [ ] **PIN masih `000000` & hardcoded** di `app/api/viewtraffic/verify/route.ts` →
      pindahkan ke env var (`DASHBOARD_PIN`) dan pakai PIN kuat. Tanpa ini proteksi
      dashboard praktis tidak berarti.
- [ ] Rate-limit pada `POST /api/viewtraffic/verify` (PIN 6 digit mudah di-brute-force).
- [ ] Cookie `vt_auth=granted` bernilai statis tanpa signature → sebaiknya pakai token
      bertanda tangan (mis. HMAC/JWT) agar tidak bisa dipalsukan manual.
- [ ] Rate-limit / validasi anti-spam pada `POST /api/events` (event mudah dipalsukan).
- [ ] Normalisasi funnel: pilih konsisten *event* atau *sesi unik* per langkah.

**P1 — Konversi**
- [ ] Render `EngagementQuiz` di landing (komponen ada, belum dipasang di `page.tsx`).
- [ ] A/B test copy headline & posisi CTA.
- [ ] Tambah `og-image.png` (dirujuk di metadata, belum ada di `public/assets`).

**P2 — Operasional**
- [ ] Set domain final (`metadataBase` masih placeholder `anana-distributor.com`).
- [ ] Ekspor CSV event dari dashboard.
- [ ] Setup GA/Meta Pixel produksi (env `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL`).

---

## 10. Definisi Selesai (untuk fitur baru)

Sebuah perubahan dianggap selesai bila: (1) `npm run build` lolos tanpa error tipe; (2) copy medis/klaim mengikuti §7; (3) CTA baru memancarkan event sesuai taksonomi §5; (4) berfungsi di light & dark mode; (5) responsif mobile; (6) tidak merusak funnel dashboard.
