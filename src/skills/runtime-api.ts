import type { BattleMove, BattlePokemon, BattleSession, BattleSide, MajorStatus, StatRanks } from '../battle/types';

export interface SkillContext {
  session: BattleSession;
  userSide: BattleSide;
  targetSide: BattleSide;
  user: BattlePokemon;
  target: BattlePokemon;
  move: BattleMove;
}

export interface SkillOps {
  dealDamage: (basePower: number, accuracy?: number | null) => number;
  applyStatus: (status: MajorStatus, targetSide?: BattleSide, chance?: number) => boolean;
  changeStatRanks: (changes: Partial<Record<keyof StatRanks, number>>, targetSide?: BattleSide) => boolean;
  heal: (target: BattleSide, ratio: number) => number;
  log: (message: string) => void;
  rng: () => number;
}

export type SkillHandler = (context: SkillContext, ops: SkillOps) => void | Promise<void>;

export interface SkillDefinition {
  id: string;
  name: string;
  handler: SkillHandler;
}
