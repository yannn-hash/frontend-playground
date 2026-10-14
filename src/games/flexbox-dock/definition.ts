import canvasCss from './canvas.css?raw';
import type { GameDefinition } from '../../shared/contracts/game';
import Arena, { markup } from './Arena';
import { missions } from './missions';
import { validate } from './validate';
export default {
  id: 'flexbox-dock',
  title: 'Flexbox Dock',
  subtitle: 'Antarkan robot ke dermaganya.',
  difficulty: 'Dasar',
  accent: '#97cbff',
  icon: 'move',
  topics: ['Flexbox', 'Alignment', 'Wrap'],
  duration: '10–15 menit',
  language: 'css',
  editable: false,
  Arena,
  arenaHtml: markup,
  arenaCss: canvasCss,
  missions,
  validate,
  craft: [
    'Kelompok robot memperlihatkan dua sumbu flex tanpa bergantung pada diagram statis.',
    'Ukuran item tetap sehingga overflow dan wrapping dapat diamati.',
    'Layout diukur pada browser agar solusi alternatif tetap diterima.',
  ],
} satisfies GameDefinition;
