import type { LayoutSnapshot } from '../../shared/contracts/game';
import { check, near, node, result } from '../../shared/contracts/checks';
export function validate(index: number, snapshots: LayoutSnapshot[]) {
  const s = snapshots[0],
    board = node(s, 'board'),
    a = node(s, 'tile1'),
    b = node(s, 'tile2'),
    c = node(s, 'tile3'),
    d = node(s, 'tile4');
  if (index === 0)
    return result([
      check(
        'columns',
        'Tiga kolom sama lebar',
        near(a.y, b.y) &&
          near(b.y, c.y) &&
          near(a.width, b.width) &&
          near(b.width, c.width) &&
          a.width < board.width / 2,
        'Tiga tile pertama harus sejajar dan sama lebar.',
      ),
      check(
        'row',
        'Tile keempat di baris berikutnya',
        d.y > a.y + a.height,
        'Sisakan baris kedua untuk tile terakhir.',
      ),
    ]);
  if (index === 1)
    return result([
      check(
        'span',
        'Header membentang dua kolom',
        near(a.width, b.width * 2 + 12),
        'Header harus selebar dua track dan satu gap.',
      ),
      check(
        'placement',
        'Sidebar ada di kanan header',
        near(a.y, b.y) && b.x > a.x + a.width,
        'Sidebar tetap pada baris pertama.',
      ),
    ]);
  return result([
    check(
      'full',
      'Header dan footer memenuhi lebar board',
      near(a.width, board.width) && near(d.width, board.width),
      'Rentangkan header dan footer melewati dua kolom.',
    ),
    check(
      'middle',
      'Sidebar kiri dan main kanan pada baris tengah',
      near(b.y, c.y) && b.x < c.x && b.y > a.y + a.height && d.y > b.y + b.height,
      'Baris tengah mempunyai dua area berbeda.',
    ),
  ]);
}
