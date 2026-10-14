import type { LayoutSnapshot, QuestScenario, QuestState } from '../../shared/contracts/game';
import { check, result } from '../../shared/contracts/checks';
const idle: QuestState = { status: 'idle', requestId: 0 };
export function scenarios(index: number): QuestScenario[] {
  const all: QuestScenario[] = [
    {
      name: 'LOAD → RESOLVE',
      initial: idle,
      events: [
        { type: 'LOAD', requestId: 1 },
        { type: 'RESOLVE', requestId: 1 },
      ],
      expected: [
        { status: 'loading', requestId: 1 },
        { status: 'success', requestId: 1 },
      ],
    },
  ];
  if (index > 0)
    all.push({
      name: 'REJECT → RETRY → RESOLVE',
      initial: idle,
      events: [
        { type: 'LOAD', requestId: 1 },
        { type: 'REJECT', requestId: 1 },
        { type: 'RETRY', requestId: 2 },
        { type: 'RESOLVE', requestId: 2 },
      ],
      expected: [
        { status: 'loading', requestId: 1 },
        { status: 'error', requestId: 1 },
        { status: 'loading', requestId: 2 },
        { status: 'success', requestId: 2 },
      ],
    });
  if (index > 1)
    all.push(
      {
        name: 'Respons lama diabaikan',
        initial: idle,
        events: [
          { type: 'LOAD', requestId: 1 },
          { type: 'LOAD', requestId: 2 },
          { type: 'RESOLVE', requestId: 1 },
          { type: 'REJECT', requestId: 1 },
          { type: 'RESOLVE', requestId: 2 },
        ],
        expected: [
          { status: 'loading', requestId: 1 },
          { status: 'loading', requestId: 2 },
          { status: 'loading', requestId: 2 },
          { status: 'loading', requestId: 2 },
          { status: 'success', requestId: 2 },
        ],
      },
      {
        name: 'CANCEL mengabaikan respons terlambat',
        initial: idle,
        events: [
          { type: 'LOAD', requestId: 3 },
          { type: 'CANCEL', requestId: 3 },
          { type: 'RESOLVE', requestId: 3 },
        ],
        expected: [
          { status: 'loading', requestId: 3 },
          { status: 'idle', requestId: 3 },
          { status: 'idle', requestId: 3 },
        ],
      },
    );
  return all;
}
export function validate(index: number, _snapshots: LayoutSnapshot[], traces?: QuestState[][]) {
  return result(
    scenarios(index).map((scenario, i) =>
      check(
        `scenario-${i}`,
        scenario.name,
        scenario.expected.every((expected, j) => {
          const actual = traces?.[i]?.[j];
          return actual?.status === expected.status && actual?.requestId === expected.requestId;
        }) && traces?.[i]?.length === scenario.expected.length,
        'Kondisi dan requestId setiap langkah harus mengikuti kejadian yang aktif.',
      ),
    ),
  );
}
