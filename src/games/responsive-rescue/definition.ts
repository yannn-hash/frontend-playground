import canvasCss from './canvas.css?raw';
import type { GameDefinition } from '../../shared/contracts/game';
import Arena, { markup } from './Arena';
import { missions } from './missions';
import { validate } from './validate';
export default {
  id: 'responsive-rescue',
  title: 'Responsive Rescue',
  subtitle: 'Satu antarmuka, banyak layar.',
  difficulty: 'Menengah',
  accent: '#ffc08a',
  icon: 'devices',
  topics: ['Responsive', 'Media query'],
  duration: '12–18 menit',
  language: 'css',
  editable: true,
  Arena,
  arenaHtml: markup,
  arenaCss: canvasCss,
  missions,
  validate,
  craft: [
    'Ukuran arena mengikuti viewport yang dipilih, bukan viewport editor.',
    'Misi terakhir diuji pada tiga ukuran otomatis.',
    'Layout dinilai dari posisi nyata elemen dan overflow.',
  ],
} satisfies GameDefinition;
