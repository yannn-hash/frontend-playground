import canvasCss from './canvas.css?raw';
import type { GameDefinition } from '../../shared/contracts/game';
import Arena, { markup } from './Arena';
import { missions } from './missions';
import { validate } from './validate';
export default {
  id: 'motion-studio',
  title: 'Motion Studio',
  subtitle: 'Gerak yang terasa, bukan berlebihan.',
  difficulty: 'Lanjutan',
  accent: '#ffabbf',
  icon: 'sparkles',
  topics: ['Transition', 'Keyframes', 'A11y'],
  duration: '12–18 menit',
  language: 'css',
  editable: true,
  Arena,
  arenaHtml: markup,
  arenaCss: canvasCss,
  missions,
  validate,
  craft: [
    'Gerak memperjelas interaksi; feedback tetap terbaca ketika gerak dihentikan.',
    'Hover dan fokus memberi feedback yang sama bagi pengguna keyboard.',
    'Penilaian menguji preferensi reduced motion secara terpisah dari animasi normal.',
  ],
} satisfies GameDefinition;
