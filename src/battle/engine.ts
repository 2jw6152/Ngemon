import type { OwnedPokemon } from './roster';
import { setSeed, uniform, uniformInt } from '../utils/rng';
import { toDisplayPokemonName } from '../utils/pokemon-name';
import { createBattleMove } from '../skills/registry';
import { chooseCpuAction, evaluateSwitch } from './ai';
import { getTypeMultiplier } from './type-chart';
import { getEffectiveStat, getStatMultiplier } from './ranks';
import {
  applyEndOfTurnStatusDamage,
  checkConfusion,
  checkStatusBeforeAction,
  getAttackMultiplierFromBurn,
  getStatusInflictMessage,
  getSpeedMultiplierFromParalysis,
  handleSwitchStatus,
  tryApplyConfusion,
  tryApplyStatus,
} from './status';
import type {
  BattleCommand,
  BattleSession,
  BattleSnapshot,
  BattlePokemon,
  BattleLogEntry,
  BattleMove,
  BattleSide,
  MajorStatus,
  SkillEffect,
} from './types';

interface Teams {
  player: OwnedPokemon[];
  opponent: OwnedPokemon[];
}

const TRAINER_LABEL: Record<BattleSide, string> = {
  player: '플레이어',
  opponent: '상대',
};

const createLog = (side: BattleLogEntry['side'], message: string): BattleLogEntry => ({
  id: crypto.randomUUID(),
  side,
  message,
  timestamp: Date.now(),
});

const pushLog = (snapshot: BattleSnapshot, side: BattleLogEntry['side'], message: string) => {
  snapshot.log.push(createLog(side, message));
  snapshot.events.push({
    id: crypto.randomUUID(),
    kind: 'log',
    side,
    message,
  });
};

const toBattlePokemon = (owned: OwnedPokemon): BattlePokemon => ({
  instanceId: owned.instanceId,
  speciesId: owned.speciesId,
  koName: toDisplayPokemonName(owned.koName),
  enName: owned.enName,
  stats: owned.stats,
  currentHp: owned.stats.hp,
  types: owned.types,
  moves: owned.moves.map(createBattleMove),
  statRanks: {
    atk: 0,
    def: 0,
    spa: 0,
    spd: 0,
    spe: 0,
    accuracy: 0,
    evasion: 0,
  },
});

const cloneMove = (move: BattlePokemon['moves'][number]) => ({ ...move });

const clonePokemon = (pokemon: BattlePokemon): BattlePokemon => ({
  ...pokemon,
  moves: pokemon.moves.map(cloneMove),
});

const cloneSnapshot = (snapshot: BattleSnapshot): BattleSnapshot => ({
  turn: snapshot.turn,
  active: {
    player: clonePokemon(snapshot.active.player),
    opponent: clonePokemon(snapshot.active.opponent),
  },
  bench: {
    player: snapshot.bench.player.map(clonePokemon),
    opponent: snapshot.bench.opponent.map(clonePokemon),
  },
  log: [...snapshot.log],
  events: [...snapshot.events],
  winner: snapshot.winner,
  surrenderedBy: snapshot.surrenderedBy,
});

const buildSnapshot = (teams: Teams): BattleSnapshot => {
  if (!teams.player.length || !teams.opponent.length) {
    throw new Error('Each side must have at least one Pokemon.');
  }

  const [playerActive, ...playerBench] = teams.player.map(toBattlePokemon);
  const [opponentActive, ...opponentBench] = teams.opponent.map(toBattlePokemon);

  return {
    turn: 1,
    active: {
      player: playerActive,
      opponent: opponentActive,
    },
    bench: {
      player: playerBench,
      opponent: opponentBench,
    },
    log: [],
    events: [],
  };
};

const validateSwitch = (snapshot: BattleSnapshot, side: BattleSide, targetIndex?: number) => {
  if (typeof targetIndex !== 'number') {
    return false;
  }
  const bench = snapshot.bench[side];
  return targetIndex >= 0 && targetIndex < bench.length && bench[targetIndex].currentHp > 0;
};

const executeSwitch = (snapshot: BattleSnapshot, side: BattleSide, targetIndex: number, options?: { skipRecall?: boolean }) => {
  const bench = snapshot.bench[side];
  if (targetIndex < 0 || targetIndex >= bench.length) {
    return false;
  }

  const incoming = bench[targetIndex];
  if (incoming.currentHp <= 0) {
    return false;
  }

  const outgoing = snapshot.active[side];
  handleSwitchStatus(outgoing);
  bench.splice(targetIndex, 1);
  bench.push(outgoing);
  snapshot.active[side] = incoming;

  if (!options?.skipRecall) {
    pushLog(snapshot, 'system', `${TRAINER_LABEL[side]}는 ${outgoing.koName}을(를) 불러들였다!`);
  }
  pushLog(snapshot, 'system', `${TRAINER_LABEL[side]}는 ${incoming.koName}을(를) 내보냈다!`);
  snapshot.events.push({
    id: crypto.randomUUID(),
    kind: 'switch',
    side,
    pokemon: incoming,
  });
  return true;
};

const normalizeMove = (pokemon: BattlePokemon, moveId?: string): BattleMove => {
  if (moveId) {
    const found = pokemon.moves.find((move) => move.id === moveId);
    if (found) {
      return found;
    }
  }
  return pokemon.moves.find((move) => move.remainingPp > 0) ?? pokemon.moves[0];
};

const announceMove = (snapshot: BattleSnapshot, side: BattleSide, moveId?: string) => {
  const attacker = snapshot.active[side];
  if (attacker.currentHp <= 0) {
    return;
  }
  const move = normalizeMove(attacker, moveId);
  const moveMessage = `${attacker.koName}의 ${move.name}!`;
  snapshot.events.push({
    id: crypto.randomUUID(),
    kind: 'move',
    side,
    moveId: move.id,
    moveName: move.name,
    message: moveMessage,
  });
  pushLog(snapshot, side, moveMessage);
};

const computeDamage = (attacker: BattlePokemon, defender: BattlePokemon, move: BattleMove) => {
  if (move.category === 'status' || !move.power) {
    return { damage: 0, critical: false, effectiveness: 1 };
  }

  const offensiveBase = move.category === 'physical' ? attacker.stats.atk : attacker.stats.spa;
  const defensiveBase = move.category === 'physical' ? defender.stats.def : defender.stats.spd;

  const offensive =
    move.category === 'physical'
      ? getEffectiveStat(offensiveBase, attacker.statRanks.atk)
      : getEffectiveStat(offensiveBase, attacker.statRanks.spa);
  const defensive =
    move.category === 'physical'
      ? getEffectiveStat(defensiveBase, defender.statRanks.def)
      : getEffectiveStat(defensiveBase, defender.statRanks.spd);

  const step1 = 22;
  const step2 = Math.floor((step1 * move.power * offensive) / 50);
  const step3 = Math.floor(step2 / Math.max(1, defensive));
  const mod1 = move.category === 'physical' ? getAttackMultiplierFromBurn(attacker) : 1;
  const step4 = Math.floor(step3 * mod1);
  const step5 = step4 + 2;

  const critical = uniform() < 1 / 24;
  const criticalMultiplier = critical ? 2 : 1;
  const step6 = Math.floor(step5 * criticalMultiplier);

  const randomInt = Math.floor(217 + uniform() * 39);
  const randomFactor = Math.floor((randomInt * 100) / 255);
  const step7 = Math.floor((step6 * randomFactor) / 100);

  const stab = attacker.types.includes(move.type) ? 1.5 : 1;
  const step8 = Math.floor(step7 * stab);

  const effectiveness = getTypeMultiplier(move.type, defender.types);
  if (effectiveness === 0) {
    return { damage: 0, critical, effectiveness };
  }

  const damage = Math.max(1, Math.floor(step8 * effectiveness));
  return { damage, critical, effectiveness };
};

const toRankRange = (rank: number) => Math.max(-6, Math.min(6, rank));

const resolveFinalAccuracy = (attacker: BattlePokemon, defender: BattlePokemon, move: BattleMove) => {
  if (move.accuracy === null || move.accuracy === undefined) {
    return null;
  }
  const rankDiff = toRankRange(attacker.statRanks.accuracy - defender.statRanks.evasion);
  const rankMultiplier = getStatMultiplier(rankDiff as Parameters<typeof getStatMultiplier>[0], true);
  return Math.max(1, Math.min(100, move.accuracy * rankMultiplier));
};

const parseMajorStatusFromEffect = (effect: SkillEffect): MajorStatus | null => {
  const raw = typeof effect.metadata?.status === 'string' ? effect.metadata.status : null;
  if (raw === 'poison' || raw === 'burn' || raw === 'paralysis' || raw === 'sleep' || raw === 'freeze') {
    return raw;
  }
  return null;
};

const applyStatusEffects = (
  snapshot: BattleSnapshot,
  attacker: BattlePokemon,
  defender: BattlePokemon,
  attackerSide: BattleSide,
  defenderSide: BattleSide,
  move: BattleMove,
) => {
  if (move.effects.length === 0) {
    return;
  }

  for (const effect of move.effects) {
    if (effect.kind !== 'status') {
      if (effect.kind !== 'custom') {
        continue;
      }
      const volatileStatus = typeof effect.metadata?.volatileStatus === 'string' ? effect.metadata.volatileStatus : null;
      if (volatileStatus !== 'confusion') {
        continue;
      }
      const target = effect.target === 'self' ? attacker : defender;
      const chance = typeof effect.chance === 'number' ? effect.chance : 100;
      if (tryApplyConfusion(target, chance)) {
        pushLog(snapshot, 'system', `${target.koName}은 혼란에 빠졌다!`);
      }
      continue;
    }
    const status = parseMajorStatusFromEffect(effect);
    if (!status) {
      continue;
    }
    const target = effect.target === 'self' ? attacker : defender;
    const targetSide: BattleSide = effect.target === 'self' ? attackerSide : defenderSide;
    const chance = typeof effect.chance === 'number' ? effect.chance : 100;
    const applied = tryApplyStatus(target, status, chance);
    if (!applied) {
      continue;
    }
    snapshot.events.push({
      id: crypto.randomUUID(),
      kind: 'status',
      side: targetSide,
      targetId: target.instanceId,
      status,
    });
    pushLog(snapshot, 'system', getStatusInflictMessage(target.koName, status));
  }
};

interface MoveOutcome {
  defenderFainted: boolean;
  defenderSide: BattleSide;
  attackerFainted: boolean;
}

const resolveMove = (snapshot: BattleSnapshot, side: BattleSide, moveId?: string): MoveOutcome => {
  const attacker = snapshot.active[side];
  const defenderSide: BattleSide = side === 'player' ? 'opponent' : 'player';
  const defender = snapshot.active[defenderSide];
  const move = normalizeMove(attacker, moveId);

  if (attacker.currentHp <= 0) {
    return { defenderFainted: false, defenderSide, attackerFainted: false };
  }

  const actionState = checkStatusBeforeAction(attacker);
  if (actionState.wakeUp || actionState.thaw) {
    snapshot.events.push({
      id: crypto.randomUUID(),
      kind: 'status',
      side,
      targetId: attacker.instanceId,
      status: null,
    });
  }
  if (actionState.message) {
    pushLog(snapshot, 'system', actionState.message);
  }
  if (!actionState.canAct) {
    return { defenderFainted: false, defenderSide, attackerFainted: false };
  }

  const confusion = checkConfusion(attacker);
  if (confusion.message) {
    pushLog(snapshot, 'system', confusion.message);
  }
  if (confusion.followupMessage) {
    pushLog(snapshot, 'system', confusion.followupMessage);
  }
  if (confusion.selfHit) {
    const selfDamage = confusion.damage ?? 0;
    if (selfDamage > 0) {
      snapshot.events.push({
        id: crypto.randomUUID(),
        kind: 'damage',
        targetSide: side,
        targetId: attacker.instanceId,
        amount: selfDamage,
        timestamp: Date.now(),
        source: 'status',
      });
    }

    const attackerFainted = attacker.currentHp <= 0;
    if (attackerFainted) {
      snapshot.events.push({
        id: crypto.randomUUID(),
        kind: 'faint',
        side,
        targetId: attacker.instanceId,
      });
      const selfFaintMessage =
        side === 'opponent'
          ? `상대의 ${attacker.koName}은(는) 쓰러졌다!`
          : `${attacker.koName}은(는) 쓰러졌다!`;
      pushLog(snapshot, 'system', selfFaintMessage);
    }
    return { defenderFainted: false, defenderSide, attackerFainted };
  }

  announceMove(snapshot, side, move.id);

  if (move.remainingPp <= 0) {
    pushLog(snapshot, 'system', '하지만 사용할 수 있는 PP가 없다!');
    return { defenderFainted: false, defenderSide, attackerFainted: false };
  }

  move.remainingPp -= 1;

  const finalAccuracy = resolveFinalAccuracy(attacker, defender, move);
  if (finalAccuracy !== null) {
    const roll = uniform() * 100;
    if (roll > finalAccuracy) {
      pushLog(snapshot, 'system', '하지만 빗나갔다!');
      return { defenderFainted: false, defenderSide, attackerFainted: false };
    }
  }

  const { damage, critical, effectiveness } = computeDamage(attacker, defender, move);

  if (damage > 0) {
    defender.currentHp = Math.max(0, defender.currentHp - damage);
    snapshot.events.push({
      id: crypto.randomUUID(),
      kind: 'damage',
      targetSide: defenderSide,
      targetId: defender.instanceId,
      amount: damage,
      timestamp: Date.now(),
      source: 'move',
    });
  }

  if (effectiveness === 0) {
    pushLog(snapshot, 'system', '효과가 전혀 없는 듯하다...');
  } else if (effectiveness > 1) {
    pushLog(snapshot, 'system', '효과가 굉장하다!');
  } else if (effectiveness < 1) {
    pushLog(snapshot, 'system', '효과가 별로인 듯하다...');
  }
  if (critical) {
    pushLog(snapshot, 'system', '급소에 맞았다!');
  }

  const defenderFainted = defender.currentHp <= 0;
  const canApplyMoveEffects = !defenderFainted && (move.category === 'status' || effectiveness !== 0);
  if (canApplyMoveEffects) {
    applyStatusEffects(snapshot, attacker, defender, side, defenderSide, move);
  }
  if (defenderFainted) {
    snapshot.events.push({
      id: crypto.randomUUID(),
      kind: 'faint',
      side: defenderSide,
      targetId: defender.instanceId,
    });
    const faintMessage =
      defenderSide === 'opponent'
        ? `상대의 ${defender.koName}은(는) 쓰러졌다!`
        : `${defender.koName}은(는) 쓰러졌다!`;
    pushLog(snapshot, 'system', faintMessage);
  }

  return { defenderFainted, defenderSide, attackerFainted: false };
};

interface FaintResolution {
  battleEnded: boolean;
  playerMustSwitch: boolean;
  autoSwitchIndex: number | null;
}

const handleFaint = (snapshot: BattleSnapshot, side: BattleSide): FaintResolution => {
  const bench = snapshot.bench[side];
  const nextIndex = bench.findIndex((pokemon) => pokemon.currentHp > 0);
  if (nextIndex < 0) {
    snapshot.winner = side === 'player' ? 'opponent' : 'player';
    snapshot.surrenderedBy = undefined;
    pushLog(snapshot, 'system', side === 'player' ? '플레이어는 남은 포켓몬이 없다!' : '상대는 남은 포켓몬이 없다!');
    return { battleEnded: true, playerMustSwitch: false, autoSwitchIndex: null };
  }

  if (side === 'opponent') {
    return { battleEnded: false, playerMustSwitch: false, autoSwitchIndex: nextIndex };
  }

  pushLog(snapshot, 'system', '다음 포켓몬을 선택해 주세요.');
  return { battleEnded: false, playerMustSwitch: true, autoSwitchIndex: null };
};

const resolveMoveOrder = (snapshot: BattleSnapshot, playerMove: BattleMove, opponentMove: BattleMove): BattleSide[] => {
  if (playerMove.priority !== opponentMove.priority) {
    return playerMove.priority > opponentMove.priority ? ['player', 'opponent'] : ['opponent', 'player'];
  }

  const playerBaseSpeed = getEffectiveStat(snapshot.active.player.stats.spe, snapshot.active.player.statRanks.spe);
  const opponentBaseSpeed = getEffectiveStat(snapshot.active.opponent.stats.spe, snapshot.active.opponent.statRanks.spe);
  const playerSpeed = Math.floor(playerBaseSpeed * getSpeedMultiplierFromParalysis(snapshot.active.player));
  const opponentSpeed = Math.floor(opponentBaseSpeed * getSpeedMultiplierFromParalysis(snapshot.active.opponent));
  if (playerSpeed !== opponentSpeed) {
    return playerSpeed > opponentSpeed ? ['player', 'opponent'] : ['opponent', 'player'];
  }

  return uniformInt(2) === 0 ? ['player', 'opponent'] : ['opponent', 'player'];
};

export interface BattleEngineConfig {
  seed?: string;
}

type PlannedStep =
  | { kind: 'switch'; side: BattleSide; targetIndex: number; skipRecall?: boolean }
  | { kind: 'move-action'; side: BattleSide; moveId?: string }
  | { kind: 'end-turn' };

export class BattleEngine {
  private session: BattleSession;
  private stepQueue: PlannedStep[] = [];

  constructor(teams: Teams, config: BattleEngineConfig = {}) {
    const seed = config.seed ?? crypto.randomUUID();
    setSeed(seed);

    this.session = {
      id: crypto.randomUUID(),
      seed,
      snapshot: buildSnapshot(teams),
      pendingChoice: null,
      status: 'awaiting',
    };
  }

  public getSession() {
    return this.session;
  }

  public getSnapshot() {
    return this.session.snapshot;
  }

  public advanceStep() {
    if (this.session.status !== 'resolving') {
      return this.session;
    }
    return this.runNextStep();
  }

  private runNextStep() {
    if (this.stepQueue.length === 0 || this.session.status !== 'resolving') {
      this.session = {
        ...this.session,
        status: this.session.snapshot.winner ? 'finished' : 'awaiting',
      };
      return this.session;
    }

    const snapshot = cloneSnapshot(this.session.snapshot);
    snapshot.events = [];
    const step = this.stepQueue.shift()!;

    let playerMustSwitch = false;

    if (step.kind === 'switch') {
      executeSwitch(snapshot, step.side, step.targetIndex, { skipRecall: step.skipRecall });
    } else if (step.kind === 'end-turn') {
      for (const side of ['player', 'opponent'] as BattleSide[]) {
        const battler = snapshot.active[side];
        if (battler.currentHp <= 0) {
          continue;
        }
        const statusResult = applyEndOfTurnStatusDamage(battler, side);
        if (statusResult.damage <= 0) {
          continue;
        }

        battler.currentHp = Math.max(0, battler.currentHp - statusResult.damage);
        snapshot.events.push({
          id: crypto.randomUUID(),
          kind: 'damage',
          targetSide: side,
          targetId: battler.instanceId,
          amount: statusResult.damage,
          timestamp: Date.now(),
          source: 'status',
        });
        if (statusResult.message) {
          pushLog(snapshot, 'system', statusResult.message);
        }

        if (battler.currentHp <= 0) {
          snapshot.events.push({
            id: crypto.randomUUID(),
            kind: 'faint',
            side,
            targetId: battler.instanceId,
          });
          const faintMessage =
            side === 'opponent'
              ? `상대의 ${battler.koName}은(는) 쓰러졌다!`
              : `${battler.koName}은(는) 쓰러졌다!`;
          pushLog(snapshot, 'system', faintMessage);

          const faintResult = handleFaint(snapshot, side);
          if (faintResult.battleEnded) {
            this.stepQueue = [];
            this.session = {
              ...this.session,
              snapshot,
              pendingChoice: null,
              status: 'finished',
            };
            return this.session;
          }
          if (side === 'opponent' && typeof faintResult.autoSwitchIndex === 'number') {
            this.stepQueue.unshift({ kind: 'switch', side: 'opponent', targetIndex: faintResult.autoSwitchIndex, skipRecall: true });
          }
          if (faintResult.playerMustSwitch) {
            playerMustSwitch = true;
          }
        }
      }
    } else {
      const outcome = resolveMove(snapshot, step.side, step.moveId);
      if (outcome.attackerFainted) {
        this.stepQueue = this.stepQueue.filter((queuedStep) => !('side' in queuedStep) || queuedStep.side !== step.side);
        const attackerFaintResult = handleFaint(snapshot, step.side);
        if (attackerFaintResult.battleEnded) {
          this.stepQueue = [];
          this.session = {
            ...this.session,
            snapshot,
            pendingChoice: null,
            status: 'finished',
          };
          return this.session;
        }
        if (step.side === 'opponent' && typeof attackerFaintResult.autoSwitchIndex === 'number') {
          this.stepQueue.unshift({ kind: 'switch', side: 'opponent', targetIndex: attackerFaintResult.autoSwitchIndex, skipRecall: true });
        }
        if (attackerFaintResult.playerMustSwitch) {
          playerMustSwitch = true;
        }
      }
      if (outcome.defenderFainted) {
        // A fainted side cannot continue queued actions for this turn.
        this.stepQueue = this.stepQueue.filter((queuedStep) => !('side' in queuedStep) || queuedStep.side !== outcome.defenderSide);
        const faintResult = handleFaint(snapshot, outcome.defenderSide);
        if (faintResult.battleEnded) {
          this.stepQueue = [];
          this.session = {
            ...this.session,
            snapshot,
            pendingChoice: null,
            status: 'finished',
          };
          return this.session;
        }
        if (outcome.defenderSide === 'opponent' && typeof faintResult.autoSwitchIndex === 'number') {
          this.stepQueue.unshift({ kind: 'switch', side: 'opponent', targetIndex: faintResult.autoSwitchIndex, skipRecall: true });
        }
        playerMustSwitch = faintResult.playerMustSwitch;
      }
    }

    if (playerMustSwitch) {
      this.stepQueue = [];
      this.session = {
        ...this.session,
        snapshot,
        pendingChoice: 'player',
        status: 'awaiting',
      };
      return this.session;
    }

    if (this.stepQueue.length === 0) {
      if (!snapshot.winner) {
        snapshot.turn += 1;
      }
      this.session = {
        ...this.session,
        snapshot,
        pendingChoice: null,
        status: snapshot.winner ? 'finished' : 'awaiting',
      };
      return this.session;
    }

    this.session = {
      ...this.session,
      snapshot,
      pendingChoice: null,
      status: 'resolving',
    };
    return this.session;
  }

  public applyPlayerCommand(command: BattleCommand) {
    if (this.session.status === 'finished' || this.session.status === 'resolving') {
      return this.session;
    }

    const currentSnapshot = this.session.snapshot;
    const requiresForcedSwitch = this.session.pendingChoice === 'player' && currentSnapshot.active.player.currentHp <= 0;

    if (requiresForcedSwitch) {
      if (command.kind !== 'switch') {
        return this.session;
      }
      const forcedSnapshot = cloneSnapshot(currentSnapshot);
      forcedSnapshot.events = [];
      if (!validateSwitch(forcedSnapshot, 'player', command.targetIndex)) {
        pushLog(forcedSnapshot, 'system', '교체할 수 없는 포켓몬입니다.');
        this.session = {
          ...this.session,
          snapshot: forcedSnapshot,
          pendingChoice: 'player',
          status: 'awaiting',
        };
        return this.session;
      }
      executeSwitch(forcedSnapshot, 'player', command.targetIndex!, { skipRecall: true });
      this.session = {
        ...this.session,
        snapshot: forcedSnapshot,
        pendingChoice: null,
        status: 'awaiting',
      };
      return this.session;
    }

    const snapshot = cloneSnapshot(this.session.snapshot);
    snapshot.events = [];

    if (command.kind === 'surrender') {
      snapshot.winner = 'opponent';
      snapshot.surrenderedBy = 'player';
      pushLog(snapshot, 'system', '플레이어가 항복했다.');

      this.session = {
        ...this.session,
        snapshot,
        pendingChoice: null,
        status: 'finished',
      };
      return this.session;
    }

    this.stepQueue = [];
    const opponentCommand = command.kind === 'move' ? chooseCpuAction(this.session) : evaluateSwitch(this.session, 'opponent') ?? chooseCpuAction(this.session);

    if (opponentCommand.kind === 'surrender') {
      snapshot.winner = 'player';
      snapshot.surrenderedBy = 'opponent';
      pushLog(snapshot, 'system', '상대가 항복했다.');
      this.session = {
        ...this.session,
        snapshot,
        pendingChoice: null,
        status: 'finished',
      };
      return this.session;
    }

    const playerIsSwitch = command.kind === 'switch';
    const opponentIsSwitch = opponentCommand.kind === 'switch';
    const playerIsMove = command.kind === 'move';
    const opponentIsMove = opponentCommand.kind === 'move';

    if (playerIsSwitch) {
      if (!validateSwitch(snapshot, 'player', command.targetIndex)) {
        pushLog(snapshot, 'system', '교체할 수 없는 포켓몬입니다.');
        this.session = {
          ...this.session,
          snapshot,
          pendingChoice: null,
          status: 'awaiting',
        };
        return this.session;
      }
    }
    if (opponentIsSwitch && !validateSwitch(snapshot, 'opponent', opponentCommand.targetIndex)) {
      if (playerIsMove) {
        this.stepQueue.push({ kind: 'move-action', side: 'player', moveId: command.moveId });
      }
      this.stepQueue.push({ kind: 'end-turn' });
      this.session = {
        ...this.session,
        snapshot,
        pendingChoice: null,
        status: this.stepQueue.length > 0 ? 'resolving' : snapshot.winner ? 'finished' : 'awaiting',
      };
      return this.stepQueue.length > 0 ? this.runNextStep() : this.session;
    }

    if (playerIsSwitch && opponentIsSwitch) {
      this.stepQueue.push({ kind: 'switch', side: 'player', targetIndex: command.targetIndex!, skipRecall: false });
      this.stepQueue.push({ kind: 'switch', side: 'opponent', targetIndex: opponentCommand.targetIndex!, skipRecall: false });
    } else if (playerIsSwitch) {
      this.stepQueue.push({ kind: 'switch', side: 'player', targetIndex: command.targetIndex!, skipRecall: false });
      if (opponentIsMove) {
        this.stepQueue.push({ kind: 'move-action', side: 'opponent', moveId: opponentCommand.moveId });
      }
    } else if (opponentIsSwitch) {
      this.stepQueue.push({ kind: 'switch', side: 'opponent', targetIndex: opponentCommand.targetIndex!, skipRecall: false });
      if (playerIsMove) {
        this.stepQueue.push({ kind: 'move-action', side: 'player', moveId: command.moveId });
      }
    } else if (playerIsMove && opponentIsMove) {
      const playerMove = normalizeMove(snapshot.active.player, command.moveId);
      const opponentMove = normalizeMove(snapshot.active.opponent, opponentCommand.moveId);
      const order = resolveMoveOrder(snapshot, playerMove, opponentMove);
      for (const side of order) {
        this.stepQueue.push({
          kind: 'move-action',
          side,
          moveId: side === 'player' ? playerMove.id : opponentMove.id,
        });
      }
    }

    this.stepQueue.push({ kind: 'end-turn' });

    this.session = {
      ...this.session,
      snapshot,
      pendingChoice: null,
      status: this.stepQueue.length > 0 ? 'resolving' : snapshot.winner ? 'finished' : 'awaiting',
    };

    return this.stepQueue.length > 0 ? this.runNextStep() : this.session;
  }
}

export const createBattleEngine = (teams: Teams, config?: BattleEngineConfig) => new BattleEngine(teams, config);
