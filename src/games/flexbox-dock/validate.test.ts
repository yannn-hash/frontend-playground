import { describe, it, expect } from 'vitest';
import { validate } from './validate';
import { element, snapshot } from '../../../tests/fixtures/layout';
describe('Flex docking', () => {
  it('rejects a missing arena or hidden robots', () => {
    expect(validate(0, []).passed).toBe(false);
    expect(
      validate(1, [
        snapshot({
          dock: element(0, 0),
          robot1: element(0, 0),
          robot2: element(0, 0),
          robot3: element(0, 0),
        }),
      ]).passed,
    ).toBe(false);
  });
  it('checks centering relative to the dock', () => {
    const nodes = {
      dock: element(300, 220),
      robot1: element(84, 70, 12, 75),
      robot2: element(84, 70, 108, 75),
      robot3: element(84, 70, 204, 75),
    };
    expect(validate(0, [snapshot(nodes)]).passed).toBe(true);
    expect(validate(1, [snapshot(nodes)]).passed).toBe(true);
    nodes.robot1.y = 0;
    expect(validate(1, [snapshot(nodes)]).passed).toBe(false);
  });
  it('requires wrapping without shrinking', () => {
    const nodes = {
      dock: element(300, 220),
      robot1: element(84, 70),
      robot2: element(84, 70, 96),
      robot3: element(84, 70, 192),
      robot4: element(84, 70, 0, 82),
      robot5: element(84, 70, 96, 82),
    };
    expect(validate(2, [snapshot(nodes)]).passed).toBe(true);
    nodes.robot4.y = 0;
    expect(validate(2, [snapshot(nodes)]).passed).toBe(false);
  });
});
