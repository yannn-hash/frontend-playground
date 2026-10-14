import type { MissionDefinition } from '../../shared/contracts/game';
export const missions: MissionDefinition[] = [
  {
    id: 'columns',
    revision: 1,
    title: 'Tiga ruang seimbang',
    objective: 'Susun tiga kolom dengan lebar sama. Tile keempat harus turun ke baris kedua.',
    starter: '.blueprint {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 12px;\n}',
    solution: '.blueprint { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }',
    hints: [
      'fr membagi ruang tersedia secara proporsional.',
      'Gunakan grid-template-columns: repeat(3, 1fr).',
    ],
    explanation:
      'Grid membagi layout menjadi track baris dan kolom. repeat(3, 1fr) membuat tiga kolom sama besar setelah gap dikurangi.',
    controls: [
      {
        label: 'Kolom',
        selector: '.blueprint',
        property: 'grid-template-columns',
        type: 'select',
        options: [
          { label: '1 kolom', value: '1fr' },
          { label: '2 kolom', value: 'repeat(2, 1fr)' },
          { label: '3 kolom', value: 'repeat(3, 1fr)' },
        ],
      },
    ],
  },
  {
    id: 'span',
    revision: 1,
    title: 'Header butuh ruang',
    objective:
      'Pertahankan tiga kolom. Buat header membentang dua kolom; sidebar berada di kolom ketiga pada baris yang sama.',
    starter:
      '.blueprint { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }\n.header { grid-column: span 1; }',
    solution:
      '.blueprint { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; } .header { grid-column:span 2; }',
    hints: [
      'Ukuran sebuah item bisa melewati lebih dari satu track.',
      'Atur grid-column: span 2 pada .header.',
    ],
    explanation:
      'grid-column dapat memilih garis awal/akhir atau jumlah track dengan span. Item lain mengikuti penempatan otomatis di ruang yang tersisa.',
    controls: [
      {
        label: 'Header span',
        selector: '.header',
        property: 'grid-column',
        type: 'select',
        options: [
          { label: '1 kolom', value: 'span 1' },
          { label: '2 kolom', value: 'span 2' },
          { label: '3 kolom', value: 'span 3' },
        ],
      },
    ],
  },
  {
    id: 'areas',
    revision: 1,
    title: 'Arsitektur dashboard',
    objective:
      'Buat header dan footer selebar board. Di antara keduanya, sidebar di kiri dan main di kanan pada satu baris.',
    starter:
      '.blueprint {\n  display: grid;\n  grid-template-columns: 1fr 2fr;\n  gap: 12px;\n}\n.header { grid-area: auto; }\n.sidebar { grid-area: auto; }\n.main { grid-area: auto; }\n.footer { grid-area: auto; }',
    solution:
      '.blueprint { display:grid; grid-template-columns:1fr 2fr; gap:12px; grid-template-areas:"header header" "sidebar main" "footer footer"; } .header{grid-area:header}.sidebar{grid-area:sidebar}.main{grid-area:main}.footer{grid-area:footer}',
    hints: [
      'Tuliskan peta area pada parent, lalu beri nama area setiap item.',
      'Peta: "header header" "sidebar main" "footer footer". Cocokkan grid-area setiap tile.',
    ],
    explanation:
      'Named areas membuat struktur layout terbaca seperti peta. Nama yang diulang harus membentuk satu persegi panjang.',
    controls: [],
  },
];
