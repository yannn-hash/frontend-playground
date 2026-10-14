# Frontend Experiment Arcade

[![CI](https://github.com/yannn-hash/frontend-playground/actions/workflows/ci.yml/badge.svg)](https://github.com/yannn-hash/frontend-playground/actions/workflows/ci.yml)
[![Site check](https://github.com/yannn-hash/frontend-playground/actions/workflows/site-check.yml/badge.svg)](https://github.com/yannn-hash/frontend-playground/actions/workflows/site-check.yml)

Playground frontend Riskiyanto: **6 game, 18 misi** CSS/JavaScript berbahasa Indonesia. Dibangun dengan React + TypeScript + Vite, tanpa akun/backend. Alamat produksi yang dituju: **https://playground.smtmtc.com/**. Badge baru aktif setelah repository/workflow dipublikasikan; alamat ini bukan bukti deployment sudah selesai.

## Mulai lokal

```powershell
npm.cmd ci
npm.cmd run dev
```

Buka URL yang dicetak Vite (default http://127.0.0.1:5173). Progres/draft tersimpan pada browser ini. Semua misi terbuka; Reset tidak menghapus penyelesaian.

## Pemeriksaan

```powershell
npx.cmd playwright install chromium
npm.cmd run verify
```

`verify`: lint → unit test → typecheck/content/build → E2E. `npm run preview` menampilkan dist. `npm run test:smoke` memeriksa domain produksi; untuk build lokal, tetapkan `SMOKE_URL=http://127.0.0.1:4173` dan jalankan preview terlebih dahulu. `npm run format` merapikan source; `format:check` memeriksa format.

## Peta proyek

| Folder              | Tanggung jawab                                    |
| ------------------- | ------------------------------------------------- |
| `src/app`           | Menggabungkan layout dan fitur                    |
| `src/features`      | Katalog, pengalaman misi/editor, progres          |
| `src/games`         | Materi, arena dan penilaian setiap game           |
| `src/platform`      | Preview, worker, storage, navigasi dan diagnostik |
| `src/shared`        | Kontrak, komponen dan design tokens               |
| `tests`             | Skenario browser dan monitoring produksi          |
| `docs`              | Keputusan, panduan kontribusi dan operasi         |
| `.github/workflows` | CI dan pemeriksaan berkala                        |

Mulai dari [arsitektur](docs/architecture.md), [produk/UX](docs/product.md), [cara menambah game](docs/adding-a-game.md), [operasional](docs/operations.md), dan [keputusan](docs/decisions.md). Source bukan file build: jangan mengedit `dist` secara manual.

## Belajar bertahap

Box Model Lab → Flexbox Dock → Grid Architect → Responsive Rescue → State Quest → Motion Studio. Game dasar memakai kontrol visual dan kode mengikuti perubahan. Game selanjutnya menyediakan CodeMirror untuk CSS atau fungsi `nextState(state,event)`. HTML arena tetap. JavaScript bekerja dengan data simulasi dalam Worker yang dapat dihentikan setelah dua detik.

Setiap misi punya tujuan, dua petunjuk, penjelasan, serta validator hasil. Validator layout membaca geometry/computed styles, sehingga solusi tidak harus ditulis dengan bentuk yang sama seperti solusi QA.

## Publikasi

Repository GitHub terpisah, main → Cloudflare Pages Git integration; command `npm run build:deploy`, output `dist`, Node 22.18. Setelah build siap, hubungkan custom domain melalui Pages, lalu jalankan Site check. Panduan lengkap dan rollback ada di operations.md. Teaser portfolio mempertahankan demo top-up.

Monitoring tersedia melalui GitHub Actions dan Cloudflare. Tidak ada pengumpulan seluruh error pengunjung, session replay, akun, atau analytics aktivitas belajar.
