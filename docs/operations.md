# Operasional, monitoring dan deployment

## Menjalankan dan memeriksa

Node 22.18+ dan npm. `npm ci`, `npm run dev`. Pemeriksaan: `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`. Browser test membutuhkan `npx playwright install chromium`. `npm run verify` menjalankan semua pemeriksaan secara berurutan. Preview build: `npm run preview -- --port 4173`.

## Cloudflare Pages

1. Buat repository GitHub terpisah `yannn-hash/frontend-playground`; gunakan `main` untuk produksi. Kredensial tidak berada dalam source.
2. Buat proyek Pages dengan **Connect to Git**; hubungkan repository. Framework Vite, root repository, build `npm run build:deploy`, output `dist`, environment `NODE_VERSION=22.18.0`.
3. Jalankan CI pull request sebelum merge. Cloudflare membangun commit main; unit/type/content/lint juga dijalankan pada build produksi. Periksa log dan commit deployment pada dashboard Cloudflare.
4. Setelah URL pages.dev berfungsi, tambahkan **Custom domains → playground.smtmtc.com**. Konfirmasikan CNAME melalui alur Pages; jangan sekadar membuat record DNS tanpa mendaftarkan domain di Pages. Tunggu status domain aktif/HTTPS.
5. Jalankan **Actions → Site check → Run workflow**. Jadwal `27,57 * * * *` memeriksa tiap 30 menit (UTC, tidak selalu tepat waktu). Smoke harus melihat HTTPS, status 200, judul, asset JS, version.json, arena dan pemeriksaan misi. HTTP 200 saja belum membuktikan aplikasi berfungsi.
6. Terapkan patch teaser portfolio yang disiapkan di `integration/`; build/check portfolio lalu upload build ke proyek portfolio yang tetap Direct Upload. Domain/proyek portfolio tidak dipindahkan.

## Membaca kegagalan

CI gagal: buka step pertama yang gagal, reproduksi dengan command sama. E2E/smoke gagal: download artifact `browser-failure`/`production-failure`, lihat report, screenshot, trace. Notifications mengikuti preferensi akun GitHub Actions, tanpa pengiriman pesan khusus dari aplikasi. Scheduled workflows pada repository publik dapat dinonaktifkan GitHub setelah lama tanpa aktivitas; periksa workflow tetap aktif secara berkala.

Deployment gagal: baca log Cloudflare dan cocokkan commit dengan CI. JS chunk 404 setelah deploy: cek version.json, refresh tanpa cache, dan apakah semua dist assets berasal dari build yang sama. Domain gagal: periksa status Custom domains, CNAME dan sertifikat; jangan mengubah nameserver/apex yang tidak terkait.

Error pengunjung: reproduksi game/misi di browser, lihat console `[arcade]` dengan scope/game/mission/error code. Logger tidak merekam draft peserta. Tidak ada agregasi error seluruh pengunjung atau analytics aktivitas; synthetic smoke menangkap page errors pada browser pemeriksa saja.

## Rilis dan pemulihan

`/version.json` mencatat version, commit, builtAt; response tidak di-cache. Metadata root hanya menunjuk custom domain produksi. Simpan link deployment/commit yang berhasil dalam catatan rilis.

Untuk rollback, buka Cloudflare Pages → Deployments → pilih deployment produksi yang pernah lolos → Rollback. Jalankan Site check sesudahnya. Untuk perbaikan berkelanjutan, revert commit bermasalah melalui PR agar Git main kembali sesuai versi yang berfungsi. Jangan menghapus localStorage pengunjung sebagai cara memperbaiki deployment.

## Batas lingkungan

Layanan diimplementasikan sebagai site statis tanpa server/API. Browser participant worker memakai policy CSP production yang melarang koneksi eksternal; local dev memakai policy Vite development. Worker menerima data simulasi, bukan rahasia. GitHub Actions bukan layanan uptime dengan SLA; tidak ada klaim persen uptime dari hasil synthetic test.
