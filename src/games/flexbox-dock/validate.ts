import type { LayoutSnapshot } from '../../shared/contracts/game';
import { check, near, node, result, visible } from '../../shared/contracts/checks';
export function validate(index: number, snapshots: LayoutSnapshot[]) {
  const s = snapshots[0],
    dock = node(s, 'dock'),
    a = node(s, 'robot1'),
    c = node(s, 'robot3');
  const present = [dock, a, node(s, 'robot2'), c].every(visible);
  if (index === 0)
    return result([
      check(
        'center',
        'Kelompok berada di tengah horizontal',
        present && near((a.x + c.x + c.width) / 2, dock.x + dock.width / 2),
        'Seimbangkan ruang kiri dan kanan kelompok.',
      ),
    ]);
  if (index === 1)
    return result([
      check(
        'horizontal',
        'Posisi horizontal tetap di tengah',
        present && near((a.x + c.x + c.width) / 2, dock.x + dock.width / 2),
        'Pertahankan justify-content: center.',
      ),
      check(
        'vertical',
        'Robot berada di tengah vertikal',
        present && near(a.y + a.height / 2, dock.y + dock.height / 2),
        'Gunakan sumbu silang untuk alignment vertikal.',
      ),
    ]);
  const d = node(s, 'robot4'),
    e = node(s, 'robot5');
  return result([
    check(
      'rows',
      'Tiga robot di atas, dua di bawah',
      present && visible(d) && visible(e) && near(a.y, c.y) && d.y > a.y + 20 && near(d.y, e.y),
      'Robot keempat dan kelima perlu pindah baris.',
    ),
    check(
      'size',
      'Ukuran robot tetap 84px dan muat',
      near(a.width, 84) && e.x + e.width <= dock.x + dock.width + 2,
      'Jangan menyusutkan robot untuk memaksakan satu baris.',
    ),
  ]);
}
