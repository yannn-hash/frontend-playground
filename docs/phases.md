# Fase dan penerimaan

| Fase              | Hasil                                                        | Penerimaan                                                                     |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| 1 — Produk/UX     | product.md, alur desktop/mobile, 18 mission definitions      | Semua misi punya tujuan, starter, petunjuk, solusi QA dan penjelasan           |
| 2 — Arsitektur    | architecture.md, contracts, adding-a-game.md, decisions.md   | Batas fitur/game/platform jelas; import terlarang diperiksa ESLint             |
| 3 — Runtime       | Katalog, player, editor, iframe, worker, storage, navigation | Alur satu misi dapat berjalan sampai penyelesaian                              |
| 4 — Game          | 6 game / 18 misi                                             | Starter ditolak dan solusi QA diterima oleh browser test untuk setiap misi     |
| 5 — QA/monitoring | Unit/E2E/smoke, CI, site-check, release identity             | Pemeriksaan lokal lolos; kegagalan menghasilkan laporan                        |
| 6 — Publikasi     | GitHub, Cloudflare Pages/domain, teaser portfolio            | Remote CI berhasil, domain HTTPS aktif, smoke produksi dan link dua arah lolos |

Fase 6 belum dianggap selesai hanya karena source ter-push. Status deployment domain harus dibuktikan melalui smoke test terhadap URL produksi. Catatan verifikasi aktual berada di VALIDATION.md.
