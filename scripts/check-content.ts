import { catalog, loaders } from '../src/games/registry.ts';
// The content-only modules deliberately have no React/CSS dependencies.
const modules = await Promise.all([
  import('../src/games/box-model/missions.ts'),
  import('../src/games/flexbox-dock/missions.ts'),
  import('../src/games/grid-architect/missions.ts'),
  import('../src/games/responsive-rescue/missions.ts'),
  import('../src/games/state-quest/missions.ts'),
  import('../src/games/motion-studio/missions.ts'),
]);
const ids = new Set<string>();
for (const [gameIndex, game] of catalog.entries()) {
  if (ids.has(game.id)) throw new Error(`Duplicate game ${game.id}`);
  ids.add(game.id);
  if (!loaders[game.id]) throw new Error(`Missing loader ${game.id}`);
  const missions = modules[gameIndex].missions;
  if (missions.length !== 3) throw new Error(`${game.id}: expected 3 missions`);
  for (const mission of missions) {
    const id = `${game.id}/${mission.id}`;
    if (ids.has(id)) throw new Error(`Duplicate mission ${id}`);
    ids.add(id);
    for (const field of ['title', 'objective', 'starter', 'solution', 'explanation'] as const)
      if (!mission[field].trim()) throw new Error(`${id}: missing ${field}`);
    if (mission.hints.length !== 2 || mission.hints.some((hint) => !hint.trim()))
      throw new Error(`${id}: incomplete hints`);
    if (mission.revision < 1) throw new Error(`${id}: invalid revision`);
  }
}
console.log('Content check passed: 6 games, 18 complete missions.');
