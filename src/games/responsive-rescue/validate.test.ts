import { describe, it, expect } from 'vitest';
import { validate } from './validate';
import { element, snapshot } from '../../../tests/fixtures/layout';
const frame = (width: number) =>
  snapshot(
    {
      rescue: element(width),
      layout: element(width),
      card1: element(width < 600 ? width : (width - 16) / 2),
      card2: element(
        width < 600 ? width : (width - 16) / 2,
        64,
        width < 600 ? 0 : (width + 16) / 2,
        width < 600 ? 80 : 0,
      ),
    },
    width,
  );
describe('Responsive rescue', () => {
  it('requires all prescribed viewports', () => {
    expect(validate(2, [frame(375), frame(768), frame(1024)]).passed).toBe(true);
    expect(validate(2, [frame(375)]).passed).toBe(false);
  });
  it('rejects mobile overflow', () => {
    const s = frame(375);
    s.nodes.card1.width = 560;
    expect(validate(0, [s]).passed).toBe(false);
  });
  it('accepts stacking and desktop columns', () => {
    expect(validate(1, [frame(375), frame(768)]).passed).toBe(true);
  });
});
