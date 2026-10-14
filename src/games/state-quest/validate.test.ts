import { describe, it, expect } from 'vitest';
import { missions } from './missions';
import { scenarios, validate } from './validate';
import type { QuestState, QuestEvent } from '../../shared/contracts/game';
describe('State quest scenarios', () => {
  for (let index = 0; index < 3; index++)
    it(`solution ${index + 1} passes every transition`, () => {
      const next = new Function(`${missions[index].solution}; return nextState;`)() as (
        state: QuestState,
        event: QuestEvent,
      ) => QuestState;
      const traces = scenarios(index).map((s) => {
        let state = s.initial;
        return s.events.map((event) => {
          state = next(state, event);
          return state;
        });
      });
      expect(validate(index, [], traces).passed).toBe(true);
    });
  it('rejects a correct final status with wrong earlier transitions', () => {
    const traces = scenarios(0).map((s) => s.expected.map((state) => ({ ...state })));
    traces[0][0].status = 'success';
    expect(validate(0, [], traces).passed).toBe(false);
  });
  it('contains stale resolve, stale reject and cancellation checks', () => {
    expect(scenarios(2)).toHaveLength(4);
    expect(validate(2, [], []).passed).toBe(false);
  });
});
