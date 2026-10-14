# Menambahkan game atau misi

## Lokasi perubahan

| Kebutuhan                             | Lokasi                                          |
| ------------------------------------- | ----------------------------------------------- |
| Judul/topik/urutan katalog            | `src/games/registry.ts`                         |
| Materi, starter, petunjuk, penjelasan | `src/games/<slug>/missions.ts`                  |
| Markup dan wrapper visual arena       | `src/games/<slug>/Arena.tsx`                    |
| Tampilan tetap arena                  | `canvas.css` (iframe) dan `arena.css` (wrapper) |
| Penilaian                             | `validate.ts` dan `validate.test.ts`            |
| Perilaku editor/misi                  | `src/features/player/`                          |
| Eksekusi atau pengukuran              | `src/platform/execution/` dan `preview/`        |

1. Gunakan satu game sejenis sebagai contoh; buat folder baru dengan file yang sama. Tambahkan slug ke `GameId` dan metadata/lazy loader ke registry. Arena tidak mengakses localStorage atau monitoring.
2. Buat tiga misi dengan id stabil, revision 1, dua petunjuk, dan solusi acuan. Jelaskan tujuan sebagai hasil yang teramati. Gunakan CSS class/data-node tetap untuk elemen yang dinilai.
3. Validator menerima snapshot/trace dan mengembalikan pemeriksaan spesifik. Hindari pencocokan teks kode; terima alternatif yang memberi hasil setara. Pastikan elemen hilang atau snapshot tidak lengkap gagal.
4. Daftarkan modul materi di `scripts/check-content.ts`; sesuaikan jumlah game/misi dan tampilan progres jika katalog diperluas. Tambahkan solusi acuan ke E2E dan tes negatif/unit.
5. Jalankan `npm run verify` dan `npm run format:check`. Kirim melalui pull request; periksa preview Cloudflare sebelum merge.

## Perubahan misi

Pertahankan id jika konsep tidak berubah. Naikkan revision ketika markup/starter/kontrak berubah sehingga draft lama diabaikan. Gunakan id baru ketika arti penyelesaian berubah. Reset draft tidak menghapus completed. Perubahan schema storage harus memberi version/key baru atau migration eksplisit; jangan menimpa schema v1 diam-diam.

## Konvensi

Komponen PascalCase; fungsi camelCase; folder kebab-case. Unit test dekat modul. Ekspor publik lewat definition dan registry; tidak perlu barrel ekspor untuk setiap file internal. Pisahkan komponen jika mempunyai tanggung jawab/state sendiri. Tidak ada batas baris sewenang-wenang, tetapi arena, penilaian, persistence dan editor tidak digabung dalam satu komponen.
