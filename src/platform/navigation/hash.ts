export interface LocationSelection {
  gameId: string;
  level: number;
}
export function parseHash(hash: string, known: string[]): LocationSelection {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const id = params.get('game');
  const raw = params.get('level');
  const level = raw && /^[1-3]$/.test(raw) ? Number(raw) - 1 : 0;
  return { gameId: id && known.includes(id) ? id : known[0], level };
}
export function selectionHash(gameId: string, level: number) {
  return `#game=${encodeURIComponent(gameId)}&level=${level + 1}`;
}
