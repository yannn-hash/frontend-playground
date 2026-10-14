import { describe, it, expect } from 'vitest';
import { validate } from './validate';
import { element, snapshot } from '../../../tests/fixtures/layout';
describe('Motion behavior', () => {
  it('requires transition and focus movement', () => {
    const s = snapshot({
      button: element(100, 64, 0, 0, {
        'transition-property': 'transform',
        'transition-duration': '0.25s',
        'tested-translate-y': '-4',
      }),
    });
    expect(validate(0, [s]).passed).toBe(true);
    s.nodes.button.styles['tested-translate-y'] = '0';
    expect(validate(0, [s]).passed).toBe(false);
  });
  it('requires normal animation plus reduced motion override', () => {
    const s = snapshot({
      orb: element(48, 48, 0, 0, {
        'animation-name': 'float',
        'animation-duration': '2s',
        'animation-iteration-count': 'infinite',
        'animation-direction': 'alternate',
        'keyframes-transform-opacity': 'true',
      }),
    });
    expect(validate(1, [s]).passed).toBe(true);
    expect(validate(2, [s]).passed).toBe(false);
    s.reduced = {
      orb: element(48, 48, 0, 0, { 'animation-name': 'none' }),
      button: element(100, 64, 0, 0, { 'transition-duration': '0s' }),
    };
    expect(validate(2, [s]).passed).toBe(true);
  });
});
