import type { MissionDefinition } from '../../shared/contracts/game';
const pulse =
  '@keyframes float { from { transform: translateY(0); opacity: 0.6; } to { transform: translateY(-16px); opacity: 1; } }';
export const missions: MissionDefinition[] = [
  {
    id: 'transition',
    revision: 1,
    title: 'Perubahan yang terasa',
    objective:
      'Beri tombol transition untuk transform selama 200–400ms. Saat hover atau fokus, tombol naik 4px. Gunakan tombol Uji interaksi untuk mencoba.',
    starter:
      '.motion-button {\n  transition: none;\n}\n.motion-button:hover, .motion-button:focus-visible {\n  transform: translateY(-4px);\n}',
    solution:
      '.motion-button{transition:transform 250ms ease}.motion-button:hover,.motion-button:focus-visible{transform:translateY(-4px)}',
    hints: [
      'Transition menjembatani nilai awal dan akhir property.',
      'Gunakan transition: transform 250ms ease pada kondisi dasar tombol.',
    ],
    explanation:
      'Transition cocok untuk perubahan state seperti hover dan focus. transform tidak mengubah alokasi ruang layout sehingga elemen sekitar tidak terdorong.',
    controls: [],
  },
  {
    id: 'keyframes',
    revision: 1,
    title: 'Orbit yang ringan',
    objective:
      'Animasikan orb memakai transform dan opacity. Durasi 1–3 detik, berulang, dan berubah arah secara bergantian.',
    starter: `.motion-orb {\n  animation: none;\n}\n${pulse}`,
    solution: `.motion-orb{animation:float 2s ease-in-out infinite alternate}${pulse}`,
    hints: [
      '@keyframes sudah tersedia; hubungkan namanya ke orb.',
      'Gunakan animation: float 2s ease-in-out infinite alternate.',
    ],
    explanation:
      'Keyframes cocok untuk rangkaian gerak. transform dan opacity biasanya lebih ringan daripada mengubah ukuran atau posisi yang memicu layout.',
    controls: [],
  },
  {
    id: 'reduced',
    revision: 1,
    title: 'Gerak punya pilihan',
    objective:
      'Pertahankan animasi normal. Ketika prefers-reduced-motion: reduce, hentikan animasi orb dan transition tombol.',
    starter: `.motion-orb{animation:float 2s ease-in-out infinite alternate}\n.motion-button{transition:transform 250ms ease}\n${pulse}\n/* Hormati preferensi reduced motion. */`,
    solution: `.motion-orb{animation:float 2s ease-in-out infinite alternate}.motion-button{transition:transform 250ms ease}${pulse}@media(prefers-reduced-motion:reduce){.motion-orb{animation:none}.motion-button{transition:none}}`,
    hints: [
      'Reduced motion berasal dari preferensi aksesibilitas pengguna.',
      'Tambahkan @media (prefers-reduced-motion: reduce), lalu animation: none dan transition: none.',
    ],
    explanation:
      'Animasi harus menghormati kebutuhan pengguna. Informasi dan interaksi tetap tersedia ketika gerak dimatikan; pengalaman tidak boleh bergantung pada animasi.',
    controls: [],
  },
];
