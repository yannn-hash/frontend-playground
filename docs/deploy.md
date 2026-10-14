# Setup Cloudflare Pages oleh pemilik

Source: `https://github.com/yannn-hash/frontend-playground`. Anda memilih mengatur Cloudflare sendiri; integrasi akun/dashboard tidak diubah oleh implementasi ini.

## Nilai yang diisi

| Pengaturan             | Nilai                          |
| ---------------------- | ------------------------------ |
| Tipe proyek            | Pages → Connect to Git         |
| Repository             | yannn-hash/frontend-playground |
| Production branch      | main                           |
| Framework              | Vite                           |
| Root directory         | kosong / root repository       |
| Build command          | npm run build:deploy           |
| Build output directory | dist                           |
| Environment variable   | NODE_VERSION = 22.18.0         |
| Custom domain          | playground.smtmtc.com          |

1. Pilih repository pada proyek Pages baru. Simpan konfigurasi build di atas dan jalankan deployment.
2. Periksa preview pages.dev: game pertama tampil; buka game CSS dan State Quest, lalu gunakan Petunjuk dan Periksa.
3. Pada **Custom domains**, tambahkan `playground.smtmtc.com`. Ikuti konfirmasi DNS melalui Pages dan tunggu HTTPS aktif. Domain portfolio tetap pada proyeknya sendiri.
4. Jalankan GitHub **Actions → Site check → Run workflow**. Setelah lolos, buka **Settings → Secrets and variables → Actions → Variables** dan tambahkan `PRODUCTION_MONITORING=true` untuk mengaktifkan jadwal tiap 30 menit. Pemeriksaan manual tetap tersedia sebelum variabel diaktifkan. Jika gagal, buka log/artifact sebelum mengubah konfigurasi.
5. Setelah Site check lolos, terapkan patch pada `integration/README.md`, periksa dan deploy ulang portfolio.

## Verifikasi manual

- https://playground.smtmtc.com/ membuka enam game dan progres 0/18 pada browser baru.
- https://playground.smtmtc.com/#game=state-quest&level=1 membuka State Quest langsung.
- https://playground.smtmtc.com/version.json menunjukkan commit deployment dan waktu build.
- CTA portfolio menuju playground; tombol Portfolio kembali ke https://portfolio.smtmtc.com/.
- https://playground.smtmtc.com/social-card.png tersedia untuk social preview.

Sumber resmi: [Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/). Cara diagnosis dan rollback: operations.md.
