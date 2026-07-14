---
name: deploy-anana
description: Build and run the anana landing page locally via Docker (app + Postgres), or run the manual Node.js flow, then verify the landing page and analytics dashboard are healthy. Use when asked to "deploy anana", "run the app", "start the site", "docker up", or to verify a build works end-to-end.
---

# Deploy & Verify — anana Super Oksigen

Skill untuk menjalankan app secara lokal dan memverifikasi sehat. Dua jalur: **Docker**
(direkomendasikan) atau **manual Node**. Selalu verifikasi setelah start.

## Langkah 0 — Deteksi konteks

- Cek Docker tersedia: `docker info` (diam-diam). Jika ada & user tidak menentukan → pakai Docker.
- Cek `DATABASE_URL` untuk jalur manual: perlu Postgres yang jalan + `.env.local`.
- Konfirmasi tidak ada port bentrok di `:3000`: `lsof -i :3000` (opsional).

## Jalur A — Docker (direkomendasikan)

```bash
docker compose up --build -d      # app + postgres; auto `prisma db push` saat start
docker compose logs -f anana-landing   # pantau sampai "Ready" / listening :3000
```

- App → http://localhost:3000 · Dashboard → http://localhost:3000/dashboard
- Stop: `docker compose down` (data disimpan) · Reset total: `docker compose down -v`
- Reload setelah ubah kode: `docker compose restart anana-landing` (volume mount live).

## Jalur B — Manual Node

```bash
npm install                        # postinstall menjalankan prisma generate
# pastikan .env.local berisi DATABASE_URL Postgres yang valid
npx prisma db push                 # sinkron schema
npm run dev                        # → http://localhost:3000
# ATAU produksi: npm run build && npm start
```

Untuk gate "apakah build sehat" tanpa menjalankan server: `npm run build` saja — WAJIB
lolos tanpa error tipe. Ini cek paling cepat setelah perubahan kode.

## Langkah verifikasi (WAJIB setelah start)

1. **Landing hidup:** `curl -sS -o /dev/null -w "%{http_code}" http://localhost:3000` → `200`.
2. **Dashboard hidup:** `curl -sS -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard` → `200`.
3. **Ingestion event bekerja** (uji end-to-end analytics + DB):
   ```bash
   curl -sS -X POST http://localhost:3000/api/events \
     -H "Content-Type: application/json" \
     -d '{"name":"page_view","sessionId":"smoke-test","source":"deploy-skill"}'
   ```
   Harap `{"ok":true}` (HTTP 201). Jika 500 → DB tidak tersambung / `prisma db push` belum jalan.
4. **Data muncul:** buka `/dashboard` — event smoke-test tampil di "Recent Events".
   (Jika ingin bersih, sesi `smoke-test` mudah dikenali & bisa diabaikan.)
5. Jika tersedia skill `/browse` atau `/qa`, tawarkan verifikasi visual light/dark + mobile.

## Troubleshooting

- **Dashboard tampil banner error DB:** container `db` belum healthy, atau schema belum di-push.
  Docker: cek `docker compose ps` (db harus healthy), lalu `docker compose restart anana-landing`.
- **`POST /api/events` 500:** `DATABASE_URL` salah / Postgres mati / schema belum ada.
- **Perubahan kode tak terlihat:** Docker → `restart anana-landing`; manual → dev server auto-reload.

## Laporkan

Ringkas: jalur yang dipakai, status build, hasil 5 langkah verifikasi (✅/❌ + kode HTTP),
dan URL yang bisa dibuka. Jangan klaim "berhasil" tanpa verifikasi HTTP 200 + event 201.
