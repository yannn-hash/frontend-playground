import type { QuestScenario, QuestState } from '../../shared/contracts/game';
export async function executeState(
  code: string,
  scenarios: QuestScenario[],
  signal?: AbortSignal,
): Promise<QuestState[][]> {
  if (signal?.aborted) throw new DOMException('Dibatalkan', 'AbortError');
  if (code.length > 50000)
    throw new Error('Kode terlalu panjang. Batas latihan adalah 50.000 karakter.');
  const source = `"use strict";\n${code}\nself.onmessage=({data})=>{try{if(typeof nextState!=="function")throw new Error("Definisikan function nextState(state, event).");const traces=data.map(s=>{let state=s.initial;return s.events.map(event=>{state=nextState(Object.freeze({...state}),Object.freeze({...event}));if(!state||typeof state.status!=="string"||typeof state.requestId!=="number")throw new Error("Kembalikan objek { status, requestId }.");return {...state};});});self.postMessage({traces});}catch(error){self.postMessage({error:error.message||"Kode tidak dapat dijalankan."});}};`;
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try {
      worker = new Worker(url);
    } catch (error) {
      URL.revokeObjectURL(url);
      reject(error);
      return;
    }
    let finished = false;
    const finish = (callback: () => void) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      signal?.removeEventListener('abort', abort);
      callback();
    };
    const abort = () => finish(() => reject(new DOMException('Dibatalkan', 'AbortError')));
    const timer = setTimeout(
      () =>
        finish(() =>
          reject(new Error('Kode melebihi 2 detik. Periksa loop atau fungsi yang tidak selesai.')),
        ),
      2000,
    );
    signal?.addEventListener('abort', abort, { once: true });
    worker.onerror = (event) => {
      event.preventDefault();
      finish(() => reject(new Error(event.message || 'JavaScript tidak valid.')));
    };
    worker.onmessage = ({ data }) =>
      finish(() => {
        if (data?.error) {
          reject(new Error(String(data.error)));
          return;
        }
        const traces: unknown = data?.traces;
        const valid =
          Array.isArray(traces) &&
          traces.length === scenarios.length &&
          traces.every(
            (trace: unknown, index: number) =>
              Array.isArray(trace) &&
              trace.length === scenarios[index].events.length &&
              trace.every((state: unknown) => {
                if (!state || typeof state !== 'object') return false;
                const value = state as QuestState;
                return (
                  ['idle', 'loading', 'success', 'error'].includes(value.status) &&
                  Number.isFinite(value.requestId)
                );
              }),
          );
        if (valid) resolve(traces as QuestState[][]);
        else
          reject(
            new Error(
              'Hasil fungsi tidak valid. Gunakan { status, requestId } untuk setiap langkah.',
            ),
          );
      });
    worker.postMessage(scenarios.map(({ initial, events }) => ({ initial, events })));
  });
}
