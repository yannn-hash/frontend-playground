import type { ProgressRecord, DraftRecord } from '../../shared/contracts/game';
export const storageKey = 'riskiyanto.arcade.progress.v1';
export const emptyProgress = (): ProgressRecord => ({ version: 1, completed: [], drafts: {} });
export interface StorageAdapter {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}
export function readProgress(storage: StorageAdapter): {
  record: ProgressRecord;
  available: boolean;
} {
  try {
    const raw = storage.getItem(storageKey);
    if (!raw) return { record: emptyProgress(), available: true };
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || !('version' in value) || value.version !== 1)
      return { record: emptyProgress(), available: true };
    const data = value as Partial<ProgressRecord>;
    const drafts: Record<string, DraftRecord> = {};
    for (const [key, draft] of Object.entries(data.drafts ?? {})) {
      if (
        /^[a-z-]+\/[a-z-]+$/.test(key) &&
        draft &&
        typeof draft === 'object' &&
        typeof draft.code === 'string' &&
        draft.code.length <= 50000 &&
        typeof draft.revision === 'number' &&
        typeof draft.manual === 'boolean'
      )
        drafts[key] = draft;
    }
    return {
      record: {
        version: 1,
        completed: Array.isArray(data.completed)
          ? [...new Set(data.completed.filter((id): id is string => typeof id === 'string'))]
          : [],
        drafts,
      },
      available: true,
    };
  } catch (error) {
    return { record: emptyProgress(), available: error instanceof SyntaxError };
  }
}
export function writeProgress(storage: StorageAdapter, record: ProgressRecord): boolean {
  try {
    storage.setItem(storageKey, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}
export function completeMission(record: ProgressRecord, id: string): ProgressRecord {
  return record.completed.includes(id)
    ? record
    : { ...record, completed: [...record.completed, id] };
}
export function saveDraft(record: ProgressRecord, id: string, draft: DraftRecord): ProgressRecord {
  return { ...record, drafts: { ...record.drafts, [id]: draft } };
}
