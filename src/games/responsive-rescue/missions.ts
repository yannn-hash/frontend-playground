import type { MissionDefinition } from '../../shared/contracts/game';
export const missions: MissionDefinition[] = [
  {
    id: 'fit',
    revision: 1,
    title: 'Selamatkan layar kecil',
    objective:
      'Kartu tidak boleh melewati wadah pada layar 375px. Pertahankan lebar yang fleksibel dengan batas maksimum 360px.',
    starter: '.rescue-card {\n  width: 560px;\n  max-width: none;\n}',
    solution: '.rescue-card { width:100%; max-width:360px; }',
    hints: [
      'Lebar tetap 560px tidak muat di viewport 375px.',
      'Gunakan width: 100% dan max-width: 360px.',
    ],
    explanation:
      'width: 100% mengikuti parent. max-width memberi batas pada layar besar tanpa memaksakan ukuran tetap pada layar kecil.',
    controls: [],
    viewports: [375],
  },
  {
    id: 'breakpoint',
    revision: 1,
    title: 'Berubah sesuai ruang',
    objective:
      'Pada 375px, dua kartu bertumpuk. Pada 768px, dua kartu sejajar. Gunakan breakpoint berdasarkan ruang yang tersedia.',
    starter:
      '.rescue-layout { display: grid; grid-template-columns: 1fr; gap: 16px; }\n.rescue-card { width: 100%; }\n/* Tambahkan media query di sini. */',
    solution:
      '.rescue-layout { display:grid; grid-template-columns:1fr; gap:16px; }.rescue-card{width:100%}@media(min-width:600px){.rescue-layout{grid-template-columns:repeat(2,1fr)}}',
    hints: [
      'Mulai dari satu kolom sebagai layout mobile.',
      'Tambahkan @media (min-width: 600px) untuk membuat dua kolom.',
    ],
    explanation:
      'Pendekatan mobile-first dimulai dari kondisi ruang paling terbatas. Breakpoint dipilih saat konten membutuhkan perubahan layout, bukan dari nama perangkat.',
    controls: [],
    viewports: [375, 768],
  },
  {
    id: 'all-screens',
    revision: 1,
    title: 'Lulus tiga layar',
    objective:
      'Pastikan layout bertumpuk di 375px, sejajar di 768px dan 1024px, tanpa overflow. Ruang konten maksimum 900px.',
    starter:
      '.rescue-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 960px; }\n.rescue-card { width: 460px; }',
    solution:
      '.rescue-layout{display:grid;grid-template-columns:1fr;gap:16px;width:100%;max-width:900px}.rescue-card{width:100%;min-width:0}@media(min-width:600px){.rescue-layout{grid-template-columns:repeat(2,minmax(0,1fr))}}',
    hints: [
      'Lebar parent dan anak harus fleksibel, bukan hanya media query-nya.',
      'Gunakan width:100%, max-width:900px, dan dua kolom mulai 600px.',
    ],
    explanation:
      'Responsif berarti seluruh rantai ukuran bekerja bersama: parent, track, item, dan isi. minmax(0, 1fr) memungkinkan track mengecil tanpa memaksakan lebar intrinsik.',
    controls: [],
    viewports: [375, 768, 1024],
  },
];
