import type { MissionDefinition } from '../../shared/contracts/game';
const starter =
  'function nextState(state, event) {\n  // Kembalikan { status, requestId } berikutnya.\n  return state;\n}';
const load = "if (event.type === 'LOAD') return { status: 'loading', requestId: event.requestId };";
const resolve = "if (event.type === 'RESOLVE') return { ...state, status: 'success' };";
export const missions: MissionDefinition[] = [
  {
    id: 'load',
    revision: 1,
    title: 'Dari menunggu ke berhasil',
    objective:
      'Tangani LOAD menjadi loading dengan requestId terbaru. RESOLVE mengubah status menjadi success.',
    starter,
    solution: `function nextState(state,event){${load}${resolve}return state;}`,
    hints: [
      'state adalah kondisi saat ini, event adalah kejadian yang datang.',
      'Periksa event.type. LOAD → loading, RESOLVE → success. Simpan event.requestId pada LOAD.',
    ],
    explanation:
      'UI bisa dipetakan sebagai state machine. Permintaan asynchronous menghasilkan kejadian yang mengubah kondisi tampilan; penilaian mensimulasikan kejadian secara deterministik.',
    controls: [],
  },
  {
    id: 'retry',
    revision: 1,
    title: 'Gagal bukan akhir',
    objective:
      'Tangani LOAD/RESOLVE, lalu REJECT → error dan RETRY → loading dengan requestId baru.',
    starter: `function nextState(state,event) {\n  ${load}\n  ${resolve}\n  return state;\n}`,
    solution: `function nextState(state,event){if(event.type==='LOAD'||event.type==='RETRY')return{status:'loading',requestId:event.requestId};if(event.type==='RESOLVE')return{...state,status:'success'};if(event.type==='REJECT')return{...state,status:'error'};return state;}`,
    hints: [
      'Error perlu menjadi state yang terlihat, bukan hanya pesan console.',
      'REJECT mengubah status menjadi error. RETRY bekerja seperti LOAD dengan requestId terbaru.',
    ],
    explanation:
      'State error memberi pengguna kesempatan pulih. Retry adalah permintaan baru, sehingga identitas request harus ikut diperbarui.',
    controls: [],
  },
  {
    id: 'stale',
    revision: 1,
    title: 'Respons lama jangan menang',
    objective:
      'Tangani semua kejadian. CANCEL → idle. Abaikan RESOLVE/REJECT jika bukan request aktif atau state bukan loading.',
    starter:
      "function nextState(state,event) {\n  if(event.type === 'LOAD' || event.type === 'RETRY')\n    return { status:'loading', requestId:event.requestId };\n  if(event.type === 'RESOLVE') return { ...state, status:'success' };\n  if(event.type === 'REJECT') return { ...state, status:'error' };\n  return state;\n}",
    solution:
      "function nextState(state,event){if(event.type==='LOAD'||event.type==='RETRY')return{status:'loading',requestId:event.requestId};if(event.type==='CANCEL')return{...state,status:'idle'};if(state.status!=='loading'||event.requestId!==state.requestId)return state;if(event.type==='RESOLVE')return{...state,status:'success'};if(event.type==='REJECT')return{...state,status:'error'};return state;}",
    hints: [
      'Dua request dapat selesai dalam urutan yang berbeda dari saat dimulai.',
      'Sebelum RESOLVE/REJECT, cek status loading dan event.requestId === state.requestId. CANCEL mengembalikan idle.',
    ],
    explanation:
      'Identitas request dan status aktif mencegah respons lama menimpa UI baru. Pembatalan juga membuat respons yang terlambat tidak berpengaruh.',
    controls: [],
  },
];
