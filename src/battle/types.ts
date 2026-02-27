export type ElementType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

import type { StatRanks } from './ranks';

export interface StatBlock {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  total: number;
}

export interface SpeciesData {
  koName: string;
  enName: string;
  slug: string;
  stats: StatBlock;
  types: ElementType[];
  learnset: string[];
}

export type SkillCategory = 'physical' | 'special' | 'status';

// 지속성 상태 이상 (Major Status)
export type MajorStatus = 'poison' | 'burn' | 'paralysis' | 'sleep' | 'freeze';

// 일회성 상태 이상 (Volatile Status)
export type VolatileStatus = 'confusion' | 'flinch';

// 상태 이상 정보
export interface StatusCondition {
  type: MajorStatus;
  turnsRemaining?: number; // 잠듦용 (1-3턴)
}

// 일회성 상태 정보
export interface VolatileCondition {
  type: VolatileStatus;
  turnsRemaining?: number; // 혼란용 (1-4턴)
}

// 스탯 랭크 (-6 ~ +6)
export type StatRank = -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SkillEffect {
  id: string;
  kind: 'damage' | 'heal' | 'status' | 'buff' | 'debuff' | 'custom';
  target: 'self' | 'opponent' | 'field';
  value?: number;
  chance?: number;
  metadata?: Record<string, unknown>;
}

export interface SkillData {
  id: string;
  name: string;
  enName?: string;
  type: ElementType;
  category: SkillCategory;
  power: number | null;
  accuracy: number | null;
  priority: number;
  pp: number;
  effects: SkillEffect[];
  description: string;
}

export interface BattleMove {
  id: string;
  name: string;
  type: ElementType;
  category: SkillCategory;
  power: number | null;
  accuracy: number | null;
  priority: number;
  pp: number;
  remainingPp: number;
  effects: SkillEffect[];
  handler?: SkillHandler;
}

export interface BattlePokemon {
  instanceId: string;
  speciesId: string;
  koName: string;
  enName: string;
  stats: StatBlock;
  currentHp: number;
  types: ElementType[];
  moves: BattleMove[];
  status?: StatusCondition; // 지속성 상태 이상
  volatileStatus?: VolatileCondition; // 일회성 상태 이상
  statRanks: StatRanks; // 스탯 랭크 (-6 ~ +6)
}

export type BattleSide = 'player' | 'opponent';

export interface BattleLogEntry {
  id: string;
  side: BattleSide | 'system';
  message: string;
  timestamp: number;
}

export interface BattleSnapshot {
  turn: number;
  active: Record<BattleSide, BattlePokemon>;
  bench: Record<BattleSide, BattlePokemon[]>;
  log: BattleLogEntry[];
  events: BattleEvent[];
  winner?: BattleSide;
  surrenderedBy?: BattleSide;
}

export interface BattleCommand {
  kind: 'move' | 'switch' | 'surrender';
  moveId?: string;
  targetIndex?: number;
}

export type BattleEvent =
  | {
      id: string;
      kind: 'log';
      side: BattleLogEntry['side'];
      message: string;
    }
  | {
      id: string;
      kind: 'hp';
      side: BattleSide;
      amount: number;
      currentHp: number;
      maxHp: number;
    }
  | {
      id: string;
      kind: 'damage';
      targetSide: BattleSide;
      targetId: string;
      amount: number;
      timestamp: number;
      source?: 'move' | 'status'; // 데미지 원인 (기술 or 상태이상)
    }
  | {
      id: string;
      kind: 'heal';
      targetSide: BattleSide;
      targetId: string;
      amount: number;
      timestamp: number;
    }
  | {
      id: string;
      kind: 'move';
      side: BattleSide;
      moveId: string;
      moveName: string;
      message?: string;
    }
  | {
      id: string;
      kind: 'faint';
      side: BattleSide;
      targetId: string;
    }
  | {
      id: string;
      kind: 'switch';
      side: BattleSide;
      pokemon: BattlePokemon;
    }
  | {
      id: string;
      kind: 'status';
      side: BattleSide;
      targetId: string;
      status: MajorStatus | null;
    }
  | {
      id: string;
      kind: 'switch-request';
      side: BattleSide;
    }
  | {
      id: string;
      kind: 'turn';
      turn: number;
    }
  | {
      id: string;
      kind: 'command';
      side: BattleSide;
      command: BattleCommand;
    }
  | {
      id: string;
      kind: 'result';
      winner: BattleSide;
      surrenderedBy?: BattleSide;
    };

export interface BattleSession {
  id: string;
  seed: string;
  snapshot: BattleSnapshot;
  pendingChoice: BattleSide | null;
  status: 'idle' | 'awaiting' | 'resolving' | 'finished';
}
import type { SkillHandler } from '../skills/runtime-api';
