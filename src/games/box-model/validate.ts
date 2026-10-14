import type { LayoutSnapshot } from '../../shared/contracts/game';
import { check, cssNumber, near, node, result } from '../../shared/contracts/checks';
export function validate(index: number, snapshots: LayoutSnapshot[]) {
  const parcel = node(snapshots[0], 'parcel');
  if (index === 0)
    return result([
      check(
        'padding',
        'Ruang dalam 24px di semua sisi',
        ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'].every((p) =>
          near(cssNumber(parcel, p), 24),
        ),
        'Padding melindungi konten di dalam border.',
      ),
      check(
        'margin',
        'Ruang luar 16px di semua sisi',
        ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'].every((p) =>
          near(cssNumber(parcel, p), 16),
        ),
        'Margin memberi jarak di luar paket.',
      ),
    ]);
  if (index === 1)
    return result([
      check(
        'width',
        'Lebar luar paket 248px',
        near(parcel.width, 248),
        `Lebar saat ini ${Math.round(parcel.width)}px; target 248px.`,
      ),
    ]);
  return result([
    check(
      'fit',
      'Lebar paket pas 240px',
      near(parcel.width, 240),
      `Lebar saat ini ${Math.round(parcel.width)}px.`,
    ),
    check(
      'padding',
      'Padding dan border tetap utuh',
      near(cssNumber(parcel, 'padding-left'), 24) &&
        near(cssNumber(parcel, 'border-left-width'), 4),
      'Pertahankan padding 24px dan border 4px.',
    ),
  ]);
}
