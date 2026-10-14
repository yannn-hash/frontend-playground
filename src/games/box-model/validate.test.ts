import { describe, it, expect } from 'vitest';
import { validate } from './validate';
import { element, snapshot } from '../../../tests/fixtures/layout';
describe('Box Model geometry', () => {
  it('requires inner and outer space on all sides', () => {
    const styles = Object.fromEntries(
      ['top', 'right', 'bottom', 'left'].flatMap((side) => [
        [`padding-${side}`, '24px'],
        [`margin-${side}`, '16px'],
      ]),
    );
    expect(validate(0, [snapshot({ parcel: element(100, 64, 0, 0, styles) })]).passed).toBe(true);
    styles['padding-bottom'] = '0px';
    expect(validate(0, [snapshot({ parcel: element(100, 64, 0, 0, styles) })]).passed).toBe(false);
  });
  it('accepts actual outer width without requiring a source spelling', () => {
    expect(validate(1, [snapshot({ parcel: element(248) })]).passed).toBe(true);
    expect(validate(1, [snapshot({ parcel: element(200) })]).passed).toBe(false);
  });
  it('does not accept removing padding to fit the parent', () => {
    expect(
      validate(2, [
        snapshot({
          parcel: element(240, 64, 0, 0, { 'padding-left': '24px', 'border-left-width': '4px' }),
        }),
      ]).passed,
    ).toBe(true);
    expect(validate(2, [snapshot({ parcel: element(240) })]).passed).toBe(false);
  });
});
