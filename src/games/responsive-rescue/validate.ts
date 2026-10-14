import type { LayoutSnapshot } from '../../shared/contracts/game';
import { check, near, node, result, visible } from '../../shared/contracts/checks';
export function validate(index: number, snapshots: LayoutSnapshot[]) {
  const sizes = index === 0 ? [375] : index === 1 ? [375, 768] : [375, 768, 1024];
  return result(
    sizes.flatMap((width) => {
      const s = snapshots.find((item) => item.viewport === width),
        root = node(s, 'rescue'),
        layout = node(s, 'layout'),
        a = node(s, 'card1'),
        b = node(s, 'card2');
      const checks = [
        check(
          `fit-${width}`,
          `Konten muat pada ${width}px`,
          !!s &&
            [root, layout, a].every(visible) &&
            a.x >= root.x - 2 &&
            a.x + a.width <= root.x + root.width + 2 &&
            layout.width <= root.width + 2,
          `Periksa ukuran parent dan kartu pada ${width}px.`,
        ),
      ];
      if (index === 0)
        checks.push(
          check(
            'max',
            'Lebar kartu tidak lebih dari 360px',
            a.width > 0 && a.width <= 362,
            'Batasi lebar tanpa membuat ukuran tetap.',
          ),
        );
      else
        checks.push(
          check(
            `layout-${width}`,
            width < 600 ? 'Kartu bertumpuk di mobile' : `Dua kartu sejajar pada ${width}px`,
            !!s &&
              visible(a) &&
              visible(b) &&
              (width < 600 ? b.y >= a.y + a.height : near(a.y, b.y) && b.x > a.x + a.width - 2),
            width < 600
              ? 'Gunakan satu kolom untuk layar kecil.'
              : 'Gunakan dua kolom ketika tersedia ruang.',
          ),
        );
      return checks;
    }),
  );
}
