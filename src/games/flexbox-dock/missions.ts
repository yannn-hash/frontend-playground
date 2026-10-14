import type { MissionDefinition } from '../../shared/contracts/game';
const select = (label: string, property: string, values: string[]) => ({
  label,
  selector: '.dock',
  property,
  type: 'select' as const,
  options: values.map((value) => ({ label: value, value })),
});
export const missions: MissionDefinition[] = [
  {
    id: 'horizontal',
    revision: 1,
    title: 'Dermaga tengah',
    objective:
      'Pusatkan seluruh kelompok robot pada sumbu horizontal dermaga. Misi ini hanya memakai tiga robot.',
    starter: '.dock {\n  display: flex;\n  justify-content: flex-start;\n}',
    solution: '.dock { display:flex; justify-content:center; }',
    hints: [
      'Pada flex-direction: row, sumbu utama bergerak horizontal.',
      'Gunakan justify-content: center untuk memusatkan kelompok.',
    ],
    explanation:
      'justify-content mengatur distribusi item sepanjang sumbu utama. Arahnya mengikuti flex-direction, bukan selalu horizontal.',
    controls: [
      select('Justify content', 'justify-content', [
        'flex-start',
        'center',
        'flex-end',
        'space-between',
        'space-around',
      ]),
    ],
  },
  {
    id: 'vertical',
    revision: 1,
    title: 'Sejajar di tengah',
    objective:
      'Pertahankan kelompok di tengah horizontal, lalu sejajarkan robot di tengah vertikal dermaga.',
    starter: '.dock {\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n}',
    solution: '.dock { display:flex; justify-content:center; align-items:center; }',
    hints: ['Sumbu silang tegak lurus terhadap sumbu utama.', 'Pilih align-items: center.'],
    explanation:
      'align-items mengatur posisi pada sumbu silang. Memisahkan main axis dan cross axis membuat alignment lebih mudah dipahami.',
    controls: [select('Align items', 'align-items', ['flex-start', 'center', 'flex-end'])],
  },
  {
    id: 'wrap',
    revision: 1,
    title: 'Semua mendapat tempat',
    objective:
      'Lima robot harus muat tanpa menyusut: tiga di baris pertama, dua di baris kedua. Jarak antarrobot tetap 12px.',
    starter:
      '.dock {\n  display: flex;\n  flex-wrap: nowrap;\n  gap: 12px;\n  align-content: center;\n}',
    solution: '.dock { display:flex; flex-wrap:wrap; gap:12px; align-content:center; }',
    hints: [
      'Robot punya ukuran tetap; pindahkan yang tidak muat ke baris berikutnya.',
      'Gunakan flex-wrap: wrap.',
    ],
    explanation:
      'Wrapping membuat item pindah baris saat ruang tidak cukup. gap memberikan jarak konsisten tanpa margin khusus pada item terakhir.',
    controls: [select('Flex wrap', 'flex-wrap', ['nowrap', 'wrap'])],
  },
];
