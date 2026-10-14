import type { LayoutSnapshot } from '../../shared/contracts/game';
import { check, node, result, visible } from '../../shared/contracts/checks';
export function validate(index: number, snapshots: LayoutSnapshot[]) {
  const s = snapshots[0],
    button = node(s, 'button'),
    orb = node(s, 'orb');
  if (index === 0) {
    const durations = (button.styles['transition-duration'] ?? '').split(',').map(parseFloat);
    return result([
      check(
        'duration',
        'Transition transform berlangsung 200–400ms',
        visible(button) &&
          durations.some((d) => d >= 0.2 && d <= 0.4) &&
          (button.styles['transition-property'] ?? '')
            .split(',')
            .some((p) => ['transform', 'all'].includes(p.trim())),
        'Gunakan durasi yang cukup terasa tanpa memperlambat interaksi.',
      ),
      check(
        'lift',
        'Hover/fokus mengangkat tombol 4px',
        Math.abs(parseFloat(button.styles['tested-translate-y'] ?? '0') + 4) < 1,
        'Beri transform translateY(-4px) pada hover dan focus-visible.',
      ),
    ]);
  }
  const animation = check(
    'animation',
    'Orb beranimasi 1–3 detik, berulang dan bergantian',
    visible(orb) &&
      orb.styles['animation-name'] !== 'none' &&
      parseFloat(orb.styles['animation-duration']) >= 1 &&
      parseFloat(orb.styles['animation-duration']) <= 3 &&
      orb.styles['animation-iteration-count'] === 'infinite' &&
      ['alternate', 'alternate-reverse'].includes(orb.styles['animation-direction']) &&
      orb.styles['keyframes-transform-opacity'] === 'true',
    'Hubungkan keyframes transform/opacity dengan animation pada orb.',
  );
  if (index === 1) return result([animation]);
  const reducedOrb = s?.reduced?.orb,
    reducedButton = s?.reduced?.button;
  return result([
    animation,
    check(
      'reduced',
      'Reduced motion menghentikan orb dan transition',
      !!reducedOrb &&
        !!reducedButton &&
        (reducedOrb.styles['animation-name'] === 'none' ||
          parseFloat(reducedOrb.styles['animation-duration']) === 0) &&
        parseFloat(reducedButton.styles['transition-duration']) === 0,
      'Tambahkan media query reduced motion tanpa menghapus versi normal.',
    ),
  ]);
}
