import { describe, it, expect } from 'vitest';
import { validate } from './validate';
import { element, snapshot } from '../../../tests/fixtures/layout';
describe('Grid arrangement', () => {
  it('checks actual rows and widths', () => {
    const nodes = {
      board: element(360),
      tile1: element(112),
      tile2: element(112, 64, 124),
      tile3: element(112, 64, 248),
      tile4: element(112, 64, 0, 76),
    };
    expect(validate(0, [snapshot(nodes)]).passed).toBe(true);
    nodes.tile3.width = 90;
    expect(validate(0, [snapshot(nodes)]).passed).toBe(false);
  });
  it('accepts a two-track header', () => {
    expect(
      validate(1, [snapshot({ tile1: element(236), tile2: element(112, 64, 248) })]).passed,
    ).toBe(true);
  });
  it('validates dashboard relationships', () => {
    const nodes = {
      board: element(360),
      tile1: element(360),
      tile2: element(112, 64, 0, 76),
      tile3: element(236, 64, 124, 76),
      tile4: element(360, 64, 0, 152),
    };
    expect(validate(2, [snapshot(nodes)]).passed).toBe(true);
    nodes.tile4.y = 0;
    expect(validate(2, [snapshot(nodes)]).passed).toBe(false);
  });
});
