import { create } from 'zustand';

import { applyPlayerCommand, advanceBattleStep as engineAdvanceBattleStep, startCpuBattle as engineStartBattle, resetBattleEngine } from '../battle/manager';
import type { BattleSession, BattleCommand, ElementType } from '../battle/types';
import type { OwnedPokemon } from '../battle/roster';
import { drawRandomPokemon } from '../utils/gacha';
import { preloadSpeciesTextures } from '../battle/preload';
import { loadSpeciesCatalog } from '../utils/catalog';
import { choice, uniformInt, getDefaultRng } from '../utils/rng';
// import type { BattleEngine } from '../battle/engine';

export interface GameState {
  trainerName: string | null;
  loggedIn: boolean;
  points: number;
  inventory: OwnedPokemon[];
  party: OwnedPokemon[];
  activeBattle: BattleSession | null;
  // engine: BattleEngine | null;
  lastBattleResult?: 'win' | 'loss' | 'surrender';
  completedBattle: { session: BattleSession; result: 'win' | 'loss' | 'surrender'; pointsGained: number } | null;
  pendingBattleResult: 'win' | 'loss' | 'surrender' | null;
  pendingSwitch: 'manual' | 'forced' | null;
  login: (name: string) => void;
  logout: () => void;
  addPoints: (amount: number) => void;
  spendPoints: (amount: number) => boolean;
  addToInventory: (pokemon: OwnedPokemon) => void;
  setParty: (party: OwnedPokemon[]) => void;
  ensureStarterParty: () => Promise<void>;
  startCpuBattle: () => Promise<void>;
  submitBattleCommand: (command: BattleCommand) => void;
  advanceBattleStep: () => void;
  clearBattleEvents: () => void;
  endBattle: (result: 'win' | 'loss' | 'surrender') => void;
  finalizeBattleResult: () => void;
  setLastBattleResult: (result: 'win' | 'loss' | 'surrender' | undefined) => void;
  acknowledgeBattleResult: () => void;
  requestPlayerSwitch: () => void;
  cancelPendingSwitch: () => void;
  changeMove: (pokemonId: string, slotIndex: number, newMove: string) => boolean;
  randomMoveChange: (
    pokemonId: string,
    slotIndex?: number,
  ) => Promise<{ success: boolean; oldMove?: string; newMove?: string; slotIndex?: number }>;
  reset: () => void;
}

const defaultState: Omit<
  GameState,
  | 'login'
  | 'logout'
  | 'addPoints'
  | 'spendPoints'
  | 'addToInventory'
  | 'setParty'
  | 'setLastBattleResult'
  | 'acknowledgeBattleResult'
  | 'finalizeBattleResult'
  | 'reset'
> = {
  trainerName: null,
  loggedIn: false,
  points: 3000,
  inventory: [],
  party: [],
  activeBattle: null,
  // engine: null,
  lastBattleResult: undefined,
  completedBattle: null,
  pendingBattleResult: null,
  pendingSwitch: null,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...defaultState,
  login: (name) =>
    set(() => ({
      trainerName: name,
      loggedIn: true,
    })),
  logout: () => set(() => ({ ...defaultState })),
  addPoints: (amount) =>
    set((state) => ({
      points: Math.max(0, state.points + amount),
    })),
  spendPoints: (amount) => {
    let allowed = false;
    set((state) => {
      if (state.points < amount) {
        allowed = false;
        return {};
      }
      allowed = true;
      return {
        points: state.points - amount,
      };
    });
    return allowed;
  },
  addToInventory: (pokemon) => {
    set((state) => ({
      inventory: [...state.inventory, pokemon],
    }));
    void preloadSpeciesTextures([pokemon.enName]);
  },
  setParty: (party) =>
    set(() => ({
      party,
    })),
  ensureStarterParty: async () => {
    if (get().inventory.length > 0) {
      return;
    }
    const starters = await Promise.all(
      Array.from({ length: 3 }).map(async () => {
        const draw = await drawRandomPokemon();
        return {
          instanceId: crypto.randomUUID(),
          speciesId: draw.speciesId,
          koName: draw.koName,
          enName: draw.enName,
          stats: draw.stats,
          types: draw.types as ElementType[],
          moves: draw.moves,
          isStarter: true,
        } satisfies OwnedPokemon;
      }),
    );
    set(() => ({
      inventory: starters,
      party: starters.slice(0, 3),
    }));
    void preloadSpeciesTextures(starters.map((starter) => starter.enName));
  },
  startCpuBattle: async () => {
    const party = get().party;
    if (!party.length) {
      return;
    }
    void preloadSpeciesTextures(party.map((member) => member.enName));
    const session = await engineStartBattle(party);
    const opponentNames = [
      session.snapshot.active.opponent.enName,
      ...session.snapshot.bench.opponent.map((poke) => poke.enName),
    ];
    void preloadSpeciesTextures(opponentNames);
    set(() => ({ activeBattle: session, lastBattleResult: undefined, completedBattle: null, pendingBattleResult: null, pendingSwitch: null }));
  },
  submitBattleCommand: (command) => {
    const { activeBattle, pendingSwitch } = get();
    if (!activeBattle) {
      return;
    }
    if (pendingSwitch === 'manual' && command.kind !== 'switch') {
      return;
    }

    const session = applyPlayerCommand(command);
    if (!session) {
      return;
    }

    const playerNeedsSwitch =
      session.pendingChoice === 'player' &&
      session.snapshot.active.player.currentHp <= 0 &&
      session.snapshot.bench.player.some((pokemon) => pokemon.currentHp > 0);
    const battleResult: 'win' | 'loss' | 'surrender' | null = session.snapshot.winner
      ? session.snapshot.winner === 'player'
        ? 'win'
        : session.snapshot.surrenderedBy === 'player'
          ? 'surrender'
          : 'loss'
      : null;

    set((state) => ({
      activeBattle: { ...session },
      pendingBattleResult: battleResult,
      pendingSwitch:
        playerNeedsSwitch
          ? 'forced'
          : state.pendingSwitch === 'manual' && command.kind !== 'switch'
            ? 'manual'
            : null,
    }));
  },
  advanceBattleStep: () => {
    const { activeBattle } = get();
    if (!activeBattle || activeBattle.status !== 'resolving') {
      return;
    }

    const session = engineAdvanceBattleStep();
    if (!session) {
      return;
    }

    const playerNeedsSwitch =
      session.pendingChoice === 'player' &&
      session.snapshot.active.player.currentHp <= 0 &&
      session.snapshot.bench.player.some((pokemon) => pokemon.currentHp > 0);
    const battleResult: 'win' | 'loss' | 'surrender' | null = session.snapshot.winner
      ? session.snapshot.winner === 'player'
        ? 'win'
        : session.snapshot.surrenderedBy === 'player'
          ? 'surrender'
          : 'loss'
      : null;

    set(() => ({
      activeBattle: { ...session },
      pendingBattleResult: battleResult,
      pendingSwitch: playerNeedsSwitch ? 'forced' : null,
    }));
  },
  clearBattleEvents: () => {
    set((state) => {
      if (!state.activeBattle || state.activeBattle.snapshot.events.length === 0) {
        return {};
      }
      return {
        activeBattle: {
          ...state.activeBattle,
          snapshot: {
            ...state.activeBattle.snapshot,
            events: [],
          },
        },
      };
    });
  },
  endBattle: (result) => {
    resetBattleEngine();
    const finishedSession = get().activeBattle;
    const rewardPoints = result === 'win' ? 500 : 0;
    set((state) => ({
      activeBattle: null,
      lastBattleResult: result,
      completedBattle: finishedSession
        ? {
            session: { ...finishedSession },
            result,
            pointsGained: rewardPoints,
          }
        : null,
      pendingBattleResult: null,
      points: state.points + rewardPoints,
      pendingSwitch: null,
    }));
  },
  finalizeBattleResult: () => {
    const pending = get().pendingBattleResult;
    if (!pending) {
      return;
    }
    get().endBattle(pending);
  },
  setLastBattleResult: (result) =>
    set(() => ({
      lastBattleResult: result,
    })),
  acknowledgeBattleResult: () =>
    set(() => ({
      completedBattle: null,
      pendingBattleResult: null,
    })),
  requestPlayerSwitch: () =>
    set((state) => {
      if (!state.activeBattle) {
        return {};
      }
      if (state.pendingSwitch === 'forced') {
        return {};
      }
      const hasCandidate = state.activeBattle.snapshot.bench.player.some((pokemon) => pokemon.currentHp > 0);
      if (!hasCandidate) {
        return {};
      }
      return {
        pendingSwitch: 'manual',
      };
    }),
  cancelPendingSwitch: () =>
    set((state) => (state.pendingSwitch === 'manual' ? { pendingSwitch: null } : {})),
  changeMove: (pokemonId, slotIndex, newMove) => {
    let success = false;
    set((state) => {
      const pokemon = [...state.inventory, ...state.party].find((p) => p.instanceId === pokemonId);
      if (!pokemon || slotIndex < 0 || slotIndex >= pokemon.moves.length) {
        success = false;
        return {};
      }
      
      // 새 기술로 교체
      const updatedMoves = [...pokemon.moves];
      updatedMoves[slotIndex] = newMove;
      pokemon.moves = updatedMoves;
      
      success = true;
      return {
        inventory: [...state.inventory],
        party: [...state.party],
      };
    });
    return success;
  },
  randomMoveChange: async (pokemonId, slotIndexOverride) => {
    const state = get();
    const pokemon = [...state.inventory, ...state.party].find((p) => p.instanceId === pokemonId);
    if (!pokemon) {
      return { success: false };
    }
    
    const catalog = await loadSpeciesCatalog();
    const species = catalog.find((s) => s.enName === pokemon.enName);
    if (!species) {
      return { success: false };
    }
    
    // 현재 가지고 있지 않은 기술 목록
    const eligibleMoves = species.learnset.filter((move) => !pokemon.moves.includes(move));
    if (eligibleMoves.length === 0) {
      return { success: false };
    }
    
    const rng = getDefaultRng();
    // 슬롯 선택 (미지정 시 랜덤)
    const slotIndex =
      typeof slotIndexOverride === 'number' && Number.isFinite(slotIndexOverride)
        ? Math.max(0, Math.min(3, Math.floor(slotIndexOverride)))
        : uniformInt(4, rng);
    // 랜덤 기술 선택
    const newMove = choice(eligibleMoves, rng);
    const oldMove = pokemon.moves[slotIndex];
    
    const success = get().changeMove(pokemonId, slotIndex, newMove);
    return { success, oldMove, newMove, slotIndex };
  },
  reset: () => set(() => ({ ...defaultState })),
}));

export type { OwnedPokemon } from '../battle/roster';
