# Produk dan pengalaman belajar

Frontend Experiment Arcade adalah bukti kemampuan frontend Riskiyanto dan tempat belajar pemula Indonesia. Tidak ada akun, backend, leaderboard, atau transaksi. Semua 18 misi terbuka. Satu badge didapat setelah tiga misi sebuah game selesai; tidak ada timer atau penalti petunjuk.

Alur: pilih game → baca tujuan → ubah kontrol/kode → amati arena → Periksa → petunjuk atau penjelasan → misi berikutnya. Penyelesaian menyimpan bukti bahwa misi pernah berhasil, bukan bahwa draft saat ini masih benar.

## Wireframe

Desktop ≥768px: header penuh; katalog 300–320px di kiri; judul game, tiga tombol misi, arena, editor/kontrol, feedback dan materi di kanan. Area arena memiliki grid halus, target visual, dan objek ilustratif. Mobile: header ringkas; tombol katalog membuka modal drawer; susunan misi → arena → kontrol/editor → feedback → penjelasan. Arena responsif dapat menggeser konten internal ketika ukuran pengujian lebih lebar daripada layar.

## Sistem desain

Tokens utama: latar #101312, surface #191e1c, surface-raised #222925, teks #eff1e8, muted #a6b0a8, lime #cefa69, border #343d35. Huruf sistem sans-serif untuk materi, monospace untuk kode. Tombol utama berisi lime; objek arena mempunyai warna per game. Ikon SVG Lucide, area sentuh ≥44px, fokus jelas, konten tidak bergantung pada hover/warna. Animasi dekoratif berhenti pada reduced motion.

## Materi

Enam game: box-model (padding/margin, ukuran, overflow), flexbox-dock (justify, align, wrap), grid-architect (kolom, span, areas), responsive-rescue (overflow, breakpoint, tiga viewport), state-quest (load/success, error/retry, cancel/stale response), motion-studio (transition, keyframes transform/opacity, reduced motion). Misi dalam setiap game berurutan 1–3. Sumber materi yang dijalankan berada di `src/games/*/missions.ts`: setiap entri menyimpan tujuan, starter, solusi acuan untuk QA, dua petunjuk, penjelasan, dan pemeriksaan hasil. Solusi acuan bukan satu-satunya jawaban.

## Error dan penyimpanan

Kode peserta yang gagal bukan error aplikasi. Editor editable mulai Grid Architect. Mengedit kode mengunci kontrol visual sampai Reset. Reset hanya mengubah draft misi aktif; tidak menghapus penyelesaian. Penyimpanan berversi, draft memiliki revision misi. Jika storage tidak tersedia, gunakan sesi dan beri pemberitahuan. Tautan hash menyimpan game/misi, tidak menyimpan kode. URL tidak valid kembali ke game pertama.
