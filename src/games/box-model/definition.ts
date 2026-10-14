import canvasCss from './canvas.css?raw';
import type { GameDefinition } from '../../shared/contracts/game';
import Arena, { markup } from './Arena';
import { missions } from './missions';
import { validate } from './validate';
export default {
  id: 'box-model',
  title: 'Box Model Lab',
  subtitle: 'Ruang kecil, pengaruh besar.',
  difficulty: 'Dasar',
  accent: '#cefa69',
  icon: 'box',
  topics: ['Padding', 'Margin', 'Sizing'],
  duration: '8–12 menit',
  language: 'css',
  editable: false,
  Arena,
  arenaHtml: markup,
  arenaCss: canvasCss,
  missions,
  validate,
  craft: [
    'Ruang dalam dan luar diberi representasi berbeda agar konsep CSS terlihat.',
    'Penilaian memakai computed style dan ukuran elemen, bukan mencocokkan teks jawaban.',
    'Kontrol native dapat digunakan dengan keyboard dan hasilnya langsung terlihat.',
  ],
} satisfies GameDefinition;
