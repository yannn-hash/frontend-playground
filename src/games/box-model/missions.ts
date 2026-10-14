import type { MissionDefinition } from '../../shared/contracts/game';
export const missions: MissionDefinition[] = [
  {
    id: 'space',
    revision: 1,
    title: 'Beri ruang bernapas',
    objective:
      'Beri paket padding 24px di dalam dan margin 16px di luar. Amati dua lapisan ruang di sekeliling konten.',
    starter: '.parcel {\n  padding: 8px;\n  margin: 0px;\n}',
    solution: '.parcel { padding: 24px; margin: 16px; }',
    hints: [
      'Padding memisahkan konten dari garis batas paket.',
      'Atur padding ke 24 dan margin ke 16. Margin berada di luar border.',
    ],
    explanation:
      'Padding adalah ruang dalam elemen; margin adalah jarak di luar elemen. Nilai yang sama dapat memberi efek berbeda karena letaknya berbeda.',
    controls: [
      {
        label: 'Padding',
        selector: '.parcel',
        property: 'padding',
        type: 'number',
        suffix: 'px',
        min: 0,
        max: 40,
      },
      {
        label: 'Margin',
        selector: '.parcel',
        property: 'margin',
        type: 'number',
        suffix: 'px',
        min: 0,
        max: 40,
      },
    ],
  },
  {
    id: 'size',
    revision: 1,
    title: 'Hitung ukuran sebenarnya',
    objective:
      'Buat lebar luar paket tepat 248px. Padding 20px dan border 4px sudah disediakan. Ubah lebar kontennya.',
    starter:
      '.parcel {\n  width: 160px;\n  padding: 20px;\n  border-width: 4px;\n  box-sizing: content-box;\n}',
    solution:
      '.parcel { width: 200px; padding: 20px; border-width: 4px; box-sizing: content-box; }',
    hints: [
      'Dalam content-box, width belum memasukkan padding dan border.',
      'Lebar luar = width + 2 × 20 + 2 × 4. Jadi width yang diperlukan adalah 200px.',
    ],
    explanation:
      'Ukuran luar content-box adalah konten + padding + border. Pada border-box, width langsung menunjukkan ukuran luar. Keduanya bisa benar ketika hasilnya sesuai.',
    controls: [
      {
        label: 'Lebar konten',
        selector: '.parcel',
        property: 'width',
        type: 'number',
        suffix: 'px',
        min: 100,
        max: 260,
      },
    ],
  },
  {
    id: 'overflow',
    revision: 1,
    title: 'Paket harus muat',
    objective:
      'Paket memiliki width 100%, padding 24px, dan border 4px. Buat lebar luarnya pas di wadah 240px tanpa memotong padding atau border.',
    starter:
      '.parcel {\n  width: 100%;\n  padding: 24px;\n  border-width: 4px;\n  box-sizing: content-box;\n}',
    solution: '.parcel { width: 100%; padding: 24px; border-width: 4px; box-sizing: border-box; }',
    hints: [
      'Lebar 100% ditambah padding dan border dapat melampaui parent.',
      'Pilih border-box supaya padding dan border termasuk di dalam width.',
    ],
    explanation:
      'box-sizing: border-box menjaga lebar yang dipilih tetap mencakup padding dan border. Ini memudahkan layout responsif dan mencegah overflow yang tidak disengaja.',
    controls: [
      {
        label: 'Box sizing',
        selector: '.parcel',
        property: 'box-sizing',
        type: 'select',
        options: [
          { label: 'content-box', value: 'content-box' },
          { label: 'border-box', value: 'border-box' },
        ],
      },
    ],
  },
];
