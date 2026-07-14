# CLAUDE.md — anana Super Oksigen Landing

Panduan untuk Claude Code saat bekerja di repo ini. Baca ini dulu sebelum mengubah kode.
PRD lengkap: [docs/PRD.md](docs/PRD.md).

## Apa ini

Landing page konversi satu-halaman + dashboard analytics untuk **anana Super Oksigen**
(air minum beroksigen, teknologi Nano Oxy Bubble™). Dioperasikan oleh **PT. Hijau Sumilir Indonesia**
sebagai Brand Owner & Regional Master Distributor (Jakarta, Depok, Bandung).

**Tujuan halaman:** ubah pengunjung → lead WhatsApp (pembeli atau reseller). Semua
interaksi kunci dilacak sebagai analytics event.

## Tech stack

- **Next.js 14** (App Router / RSC) · **React 18** · **TypeScript strict**
- **Tailwind CSS** + **Framer Motion** · ikon **lucide-react**
- **Prisma 5** + **PostgreSQL** (event store analitik, satu tabel `Event`)
- **Docker Compose** (app + db) — cara deploy yang direkomendasikan
- Alias impor: `@/*` → root repo (mis. `@/lib/config`, `@/components/Hero`)

## Perintah

```bash
npm run dev                 # dev server → http://localhost:3000
npm run build               # production build (WAJIB lolos sebelum "selesai")
npm start                   # jalankan hasil build
npm run lint                # eslint (next lint)
npx prisma db push          # sinkron schema ke DB
npx prisma generate         # regenerate client (juga jalan otomatis di postinstall)

docker compose up --build -d   # deploy penuh (app + Postgres), auto db push
docker compose down            # stop (data disimpan); tambah -v untuk hapus data
```

Butuh `DATABASE_URL` (Postgres). Di Docker sudah diset; manual → `.env.local`.

## Peta repo

```
app/
  page.tsx              # Landing — urutan section didefinisikan di sini
  layout.tsx            # metadata SEO, font, ThemeProvider, Analytics global
  dashboard/page.tsx    # Dashboard analytics (RSC, force-dynamic)
  api/events/route.ts   # Ingestion event: POST { name, source?, sessionId, referrer? }
  globals.css           # CSS vars tema (--bg-900, --accent-blue, --anana-red, dst.)
components/             # Section landing (Hero, Kemitraan, Testimonials, ...)
  ui/                   # Primitif: Button, Analytics, SectionTracker, ThemeToggle, CountUp, dll.
lib/
  content.id.ts         # SEMUA copy (Bahasa Indonesia) — lihat aturan konten di bawah
  config.ts             # Nomor WA, identitas distributor/prinsipal, waLink(), env analytics
  prisma.ts             # Singleton PrismaClient
  session.ts            # getSessionId() — UUID per sesi di sessionStorage
prisma/schema.prisma    # Model Event
docs/PRD.md             # Product Requirements Document
```

## Aturan yang tidak boleh dilanggar

1. **Konten prinsipal itu sakral.** Copy di [lib/content.id.ts](lib/content.id.ts) verbatim
   dari prinsipal — **jangan ubah tanpa sign-off**. Kalau diminta ubah copy, konfirmasi
   dulu bahwa perubahan sudah disetujui.

2. **Kepatuhan medis.** Produk **bukan obat**. Jangan menulis klaim menyembuhkan/mengobati.
   `TESTIMONIAL_DISCLAIMER` wajib tetap tampil di section testimoni. Klaim "5X oksigen"
   selalu bawa footnote pembanding.

3. **Kontrak analytics.** Setiap CTA/aksi kunci baru **wajib** memanggil
   `trackEvent(name, { source })` dari [components/ui/Analytics.tsx](components/ui/Analytics.tsx).
   Nama event konversi (`wa_click`, `kemitraan_click`, `page_view`) stabil — jangan
   rename tanpa memperbarui `/dashboard`. Taksonomi lengkap ada di PRD §5.

4. **Identitas & kontak** hanya dari [lib/config.ts](lib/config.ts). Jangan hardcode
   nomor WA atau nama entitas di komponen — impor dari config. Gunakan `waLink(msg)`.

5. **Definisi selesai:** `npm run build` lolos · CTA baru terlacak · light & dark mode OK ·
   responsif mobile · funnel dashboard tidak rusak.

## Konvensi kode

- Komponen section: named export (`export function Hero()`), file `PascalCase.tsx`.
- Komponen interaktif (state/effect/onClick) butuh `"use client"`. Section statis biarkan RSC.
- Styling pakai Tailwind + **CSS custom properties** untuk tema
  (`var(--accent-blue)`, `var(--bg-800)`, `var(--anana-red)`, `var(--text-muted)`). Jangan
  hardcode warna hex untuk elemen tematik — pakai var agar light/dark ikut.
- Animasi pakai Framer Motion; hormati `whileInView` + `viewport={{ once: true }}` seperti section lain.
- Server component untuk fetch data (lihat dashboard). Jangan impor `prisma` ke client component.

## Analytics — cara kerja singkat

`trackEvent(name, params)` → (1) kirim ke `gtag`/`fbq` bila diaktifkan, (2) `POST /api/events`
fire-and-forget dengan `sessionId` dari `getSessionId()`. Dashboard membaca agregat dari
tabel `Event`. Dua tracker otomatis global di layout: `Analytics` (`page_view`) &
`ScrollDepthTracker` (`scroll_depth_75`). `SectionTracker` (IntersectionObserver, threshold 0.3)
memancarkan `section_view` per section funnel.

## Jebakan yang sudah diketahui

- `sessionId` = per-tab-session (`sessionStorage`), bukan per-user. "Unique Sessions" ≈ sesi tab.
- Funnel dashboard mencampur hitungan *event* dan *sesi unik* antar langkah (lihat PRD §9).
- **PIN dashboard masih `000000` dan di-hardcode** di `app/api/viewtraffic/verify/route.ts`,
  tanpa rate-limit → praktis belum aman. Pindahkan ke env var + PIN kuat. (backlog P0)
- `POST /api/events` **tanpa auth/rate-limit** — event mudah dipalsukan. (backlog P0)
- `og-image.png` dirujuk di metadata tapi mungkin belum ada di `public/assets`.
- `EngagementQuiz` ada sebagai komponen tapi belum dipasang di `page.tsx`.
- `next.config.mjs` **wajib** mempertahankan `output: "standalone"` — Dockerfile produksi
  menjalankan `.next/standalone/server.js`. Menghapusnya akan merusak deploy VM20.

## Sub-agents & skills

Repo ini menyediakan agent & skill khusus di `.claude/`:
- **agent `anana-analytics-auditor`** — verifikasi kontrak event & integritas funnel.
- **agent `anana-content-compliance`** — cek kepatuhan klaim medis/copy prinsipal.
- **agent `anana-section-builder`** — bangun section landing baru sesuai konvensi.
- **skill `/deploy-anana`** — build & jalankan lewat Docker, verifikasi kesehatan.
- **skill `/add-landing-section`** — scaffold section baru + wiring analytics.
