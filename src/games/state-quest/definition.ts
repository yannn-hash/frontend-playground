import type { GameDefinition } from '../../shared/contracts/game';
import Arena from './Arena';
import { missions } from './missions';
import { validate, scenarios } from './validate';
export default {
  id: 'state-quest',
  title: 'State Quest',
  subtitle: 'Selamatkan alur yang tersendat.',
  difficulty: 'Lanjutan',
  accent: '#90e4cc',
  icon: 'route',
  topics: ['JavaScript', 'State', 'Async'],
  duration: '15–20 menit',
  language: 'javascript',
  editable: true,
  Arena,
  arenaHtml: '',
  arenaCss: '',
  missions,
  validate,
  scenarios,
  craft: [
    'Kejadian asynchronous disimulasikan tanpa API atau data pengunjung.',
    'Kode peserta berjalan dalam Worker; loop tidak membekukan antarmuka.',
    'Host membandingkan seluruh transisi, bukan hanya status terakhir.',
  ],
} satisfies GameDefinition;
