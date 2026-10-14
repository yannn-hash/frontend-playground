# Menghubungkan portfolio

Patch `portfolio-playground.patch` menambahkan teaser berbahasa Inggris dengan CTA **Explore the Playground**, tanpa menghapus form top-up. Patch sudah dipersiapkan terhadap source `portfolio-frontdev` dan dapat diperiksa tanpa mempublikasikan perubahan.

Terapkan **setelah playground.smtmtc.com aktif dan smoke test produksi lolos**, supaya portfolio tidak mengarah ke domain yang belum siap.

```powershell
# Jalankan dari folder portfolio-frontdev (sesuaikan path patch jika diperlukan).
git apply --check '../playground-frontend/integration/portfolio-playground.patch'
git apply '../playground-frontend/integration/portfolio-playground.patch'
npm.cmd run check
npm.cmd test
npm.cmd run build
```

Periksa CTA, form top-up dan tampilan mobile. Upload hasil build portfolio ke proyek Cloudflare portfolio yang sudah ada. Jangan upload build playground ke proyek portfolio.

Jika source portfolio berubah, ulangi check dan sesuaikan patch; jangan gunakan force/reset untuk menimpa perubahan lain. Mengembalikan patch sebelum ada perubahan lanjutan: `git apply --reverse portfolio-playground.patch`.
