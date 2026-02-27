import type { BattleCommand, BattleSession } from './types';
import type { OwnedPokemon } from './roster';
import { createBattleEngine } from './engine';
import { drawRandomPokemon } from '../utils/gacha';
import type { ElementType } from './types';

const CPU_TEAM_SIZE = 3;

let activeEngine: ReturnType<typeof createBattleEngine> | null = null;

const cloneOwned = (pokemon: OwnedPokemon): OwnedPokemon => ({
  ...pokemon,
  moves: [...pokemon.moves],
});

const toOwnedFromDraw = (seed: Awaited<ReturnType<typeof drawRandomPokemon>>): OwnedPokemon => ({
  instanceId: crypto.randomUUID(),
  speciesId: seed.speciesId,
  koName: seed.koName,
  enName: seed.enName,
  stats: seed.stats,
  types: seed.types as ElementType[],
  moves: seed.moves,
});

const buildCpuTeam = async (size: number) => {
  const team: OwnedPokemon[] = [];
  while (team.length < size) {
    const drawn = await drawRandomPokemon();
    team.push(toOwnedFromDraw(drawn));
  }
  return team;
};

export const startCpuBattle = async (playerTeam: OwnedPokemon[]): Promise<BattleSession> => {
  if (!playerTeam.length) {
    throw new Error('Player team is empty');
  }
  const opponentTeam = await buildCpuTeam(Math.min(CPU_TEAM_SIZE, playerTeam.length));
  activeEngine = createBattleEngine({ player: playerTeam.map(cloneOwned), opponent: opponentTeam });
  return activeEngine.getSession();
};

export const applyPlayerCommand = (command: BattleCommand): BattleSession | null => {
  if (!activeEngine) {
    return null;
  }
  return activeEngine.applyPlayerCommand(command);
};

export const advanceBattleStep = (): BattleSession | null => {
  if (!activeEngine) {
    return null;
  }
  return activeEngine.advanceStep();
};

export const resetBattleEngine = () => {
  activeEngine = null;
};

export const getActiveSession = () => activeEngine?.getSession() ?? null;
