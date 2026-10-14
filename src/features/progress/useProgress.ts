import { useCallback, useEffect, useState } from 'react';
import {
  completeMission,
  emptyProgress,
  readProgress,
  saveDraft,
  writeProgress,
} from '../../platform/storage/progress';
import type { DraftRecord, ProgressRecord } from '../../shared/contracts/game';
export function useProgress() {
  const [initial] = useState(() => {
    try {
      return readProgress(localStorage);
    } catch {
      return { record: emptyProgress(), available: false };
    }
  });
  const [record, setRecord] = useState<ProgressRecord>(initial.record);
  const [available, setAvailable] = useState(initial.available);
  useEffect(() => {
    try {
      if (!writeProgress(localStorage, record)) setAvailable(false);
    } catch {
      setAvailable(false);
    }
  }, [record]);
  const complete = useCallback(
    (id: string) => setRecord((previous) => completeMission(previous, id)),
    [],
  );
  const draft = useCallback(
    (id: string, value: DraftRecord) => setRecord((previous) => saveDraft(previous, id, value)),
    [],
  );
  return { record, available, complete, draft };
}
