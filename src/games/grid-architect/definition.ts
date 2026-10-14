import canvasCss from './canvas.css?raw';
import type { GameDefinition } from '../../shared/contracts/game';
import Arena, { markup } from './Arena';
import { missions } from './missions';
import { validate } from './validate';
export default {
  id: 'grid-architect',
  title: 'Grid Architect',
  subtitle: 'Susun ruang. Bangun kemungkinan.',
  difficulty: 'Menengah',
  accent: '#c5a8ff',
  icon: 'grid',
  topics: ['Grid', 'Span', 'Areas'],
  duration: '12–18 menit',
  language: 'css',
  editable: true,
  Arena,
  arenaHtml: markup,
  arenaCss: canvasCss,
  missions,
  validate,
  craft: [
    'Validator menerima span atau penempatan garis yang menghasilkan layout sama.',
    'Markup tetap memisahkan latihan CSS dari kerumitan editor HTML.',
    'Computed geometry membuat hasil terlihat konsisten dengan penilaian.',
  ],
} satisfies GameDefinition;
