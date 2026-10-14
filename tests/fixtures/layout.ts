import type { ElementSnapshot, LayoutSnapshot } from '../../src/shared/contracts/game';
export function element(
  width = 100,
  height = 64,
  x = 0,
  y = 0,
  styles: Record<string, string> = {},
): ElementSnapshot {
  return { width, height, x, y, styles };
}
export const snapshot = (
  nodes: Record<string, ElementSnapshot>,
  viewport = 480,
): LayoutSnapshot => ({ viewport, nodes });
