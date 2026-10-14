import { it, expect } from 'vitest';
import { parseHash, selectionHash } from './hash';
it('supports deep links and rejects malformed selections', () => {
  expect(parseHash('#game=grid&level=2', ['box', 'grid'])).toEqual({ gameId: 'grid', level: 1 });
  expect(parseHash('#game=other&level=99', ['box', 'grid'])).toEqual({ gameId: 'box', level: 0 });
  expect(parseHash('#game=grid&level=1.5', ['box', 'grid']).level).toBe(0);
  expect(selectionHash('grid', 2)).toBe('#game=grid&level=3');
});
