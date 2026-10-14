import { describe, it, expect } from 'vitest';
import { readProgress, writeProgress, completeMission, saveDraft, emptyProgress } from './progress';
describe('Progress persistence', () => {
  it('recovers invalid JSON', () => {
    expect(readProgress({ getItem: () => '{', setItem: () => {} })).toEqual({
      record: emptyProgress(),
      available: true,
    });
  });
  it('falls back when storage access is blocked', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    };
    expect(readProgress(storage).available).toBe(false);
    expect(writeProgress(storage, emptyProgress())).toBe(false);
  });
  it('deduplicates completions and preserves them when resetting a draft', () => {
    let p = completeMission(emptyProgress(), 'box-model/space');
    p = completeMission(p, 'box-model/space');
    p = saveDraft(p, 'box-model/space', { code: 'a', manual: false, revision: 1 });
    expect(p.completed).toEqual(['box-model/space']);
  });
  it('ignores incompatible versions and invalid draft values', () => {
    expect(
      readProgress({ getItem: () => JSON.stringify({ version: 2 }), setItem: () => {} }).record,
    ).toEqual(emptyProgress());
    const p = readProgress({
      getItem: () =>
        JSON.stringify({ version: 1, completed: ['a', 'a', null], drafts: { bad: { code: 3 } } }),
      setItem: () => {},
    });
    expect(p.record.completed).toEqual(['a']);
    expect(p.record.drafts).toEqual({});
  });
});
