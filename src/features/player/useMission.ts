import { useEffect, useRef, useState } from 'react';
import type {
  DraftRecord,
  GameDefinition,
  QuestState,
  ValidationResult,
} from '../../shared/contracts/game';
import { evaluateCss } from '../../platform/preview/frame';
import { executeState } from '../../platform/execution/worker';
import { reportError } from '../../platform/monitoring/logger';
interface Options {
  game: GameDefinition;
  level: number;
  draft?: DraftRecord;
  onDraft: (id: string, draft: DraftRecord) => void;
  onComplete: (id: string) => void;
}
export function useMission({ game, level, draft, onDraft, onComplete }: Options) {
  const mission = game.missions[level];
  const missionKey = `${game.id}/${mission.id}`;
  const [code, setCode] = useState(
    draft?.revision === mission.revision ? draft.code : mission.starter,
  );
  const [manual, setManual] = useState(draft?.revision === mission.revision ? draft.manual : false);
  const [hint, setHint] = useState(0);
  const [feedback, setFeedback] = useState<ValidationResult | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'controls' | 'code'>(
    mission.controls.length ? 'controls' : 'code',
  );
  const [width, setWidth] = useState(mission.viewports?.[0] ?? 480);
  const [traces, setTraces] = useState<QuestState[][]>();
  const [craft, setCraft] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const request = useRef<AbortController | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  useEffect(() => () => request.current?.abort(), []);
  const update = (next: string, edited: boolean) => {
    if (next === code) return;
    request.current?.abort();
    setBusy(false);
    setCode(next);
    setManual(edited || manual);
    setFeedback(null);
    setError('');
    setTraces(undefined);
    onDraft(missionKey, { code: next, manual: edited || manual, revision: mission.revision });
  };
  const reset = () => {
    request.current?.abort();
    setCode(mission.starter);
    setManual(false);
    setFeedback(null);
    setError('');
    setHint(0);
    setBusy(false);
    setTraces(undefined);
    onDraft(missionKey, { code: mission.starter, manual: false, revision: mission.revision });
  };
  const run = async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setFeedback(null);
    setError('');
    try {
      let answer: ValidationResult;
      if (game.language === 'javascript') {
        const trace = await executeState(code, game.scenarios!(level), controller.signal);
        setTraces(trace);
        answer = game.validate(level, [], trace);
      } else {
        const snapshots = await evaluateCss({
          html: game.arenaHtml,
          base: game.arenaCss,
          code,
          mission: level,
          viewports: mission.viewports ?? [480],
          motion: game.id === 'motion-studio',
          signal: controller.signal,
        });
        answer = game.validate(level, snapshots);
      }
      if (controller.signal.aborted) return;
      setFeedback(answer);
      if (answer.passed) onComplete(missionKey);
    } catch (cause) {
      if (controller.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : 'Pemeriksaan gagal. Coba lagi.');
      if (game.language !== 'javascript')
        reportError(cause, {
          scope: 'preview',
          gameId: game.id,
          missionId: mission.id,
          code: 'PREVIEW_CHECK_FAILED',
        });
    } finally {
      if (!controller.signal.aborted) {
        setBusy(false);
        setTimeout(() => feedbackRef.current?.focus({ preventScroll: true }), 0);
      }
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus('Kode disalin');
    } catch {
      setCopyStatus('Pilih kode untuk menyalin manual');
    }
    setTimeout(() => setCopyStatus(''), 2500);
  };
  return {
    mission,
    missionKey,
    code,
    manual,
    hint,
    setHint,
    feedback,
    error,
    busy,
    tab,
    setTab,
    width,
    setWidth,
    traces,
    craft,
    setCraft,
    copyStatus,
    feedbackRef,
    update,
    reset,
    run,
    copy,
  };
}
