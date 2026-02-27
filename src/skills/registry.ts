import skills from '../../data/skills.json';
import manualSkillEffects from '../../data/skill_effects.manual.json';

import { getSkillHandlerByName } from './index';
import type { BattleMove, SkillData, SkillEffect, MajorStatus } from '../battle/types';

const skillCatalog = (skills as SkillData[]).reduce<Record<string, SkillData>>((acc, skill) => {
  acc[skill.name] = skill;
  return acc;
}, {});

export const getSkillByName = (name: string) => skillCatalog[name] ?? null;

interface ManualEffectEntry {
  kind: 'status' | 'buff' | 'debuff' | 'heal' | 'damage' | 'custom';
  target: 'self' | 'opponent' | 'field';
  chance?: number;
  // status-specific
  status?: MajorStatus;
  // rank-specific
  stat?: 'atk' | 'def' | 'spa' | 'spd' | 'spe' | 'accuracy' | 'evasion';
  stages?: number;
  // heal/damage/custom shared payload
  value?: number;
  metadata?: Record<string, unknown>;
}

interface ManualMoveEntry {
  name?: string;
  effects: ManualEffectEntry[];
}

const manualCatalog = manualSkillEffects as Record<string, ManualMoveEntry>;

const normalizeManualEffect = (skillId: string, effect: ManualEffectEntry, index: number): SkillEffect | null => {
  const chance =
    typeof effect.chance === 'number' && Number.isFinite(effect.chance)
      ? Math.max(1, Math.min(100, Math.floor(effect.chance)))
      : undefined;

  if (effect.kind === 'status') {
    if (!effect.status) {
      return null;
    }
    return {
      id: `manual-${skillId}-status-${index}`,
      kind: 'status',
      target: effect.target,
      chance,
      metadata: {
        status: effect.status,
        ...effect.metadata,
      },
    };
  }

  if (effect.kind === 'buff' || effect.kind === 'debuff') {
    if (!effect.stat || typeof effect.stages !== 'number' || !Number.isFinite(effect.stages)) {
      return null;
    }
    return {
      id: `manual-${skillId}-${effect.kind}-${index}`,
      kind: effect.kind,
      target: effect.target,
      chance,
      metadata: {
        stat: effect.stat,
        stages: Math.trunc(effect.stages),
        ...effect.metadata,
      },
    };
  }

  return {
    id: `manual-${skillId}-${effect.kind}-${index}`,
    kind: effect.kind,
    target: effect.target,
    chance,
    value: typeof effect.value === 'number' && Number.isFinite(effect.value) ? effect.value : undefined,
    metadata: effect.metadata,
  };
};

const buildEffects = (skill: SkillData): SkillEffect[] => {
  const manual = manualCatalog[skill.id];
  if (!manual || !Array.isArray(manual.effects)) {
    return skill.effects.length > 0 ? skill.effects : [];
  }
  return manual.effects
    .map((effect, index) => normalizeManualEffect(skill.id, effect, index))
    .filter((effect): effect is SkillEffect => !!effect);
};

export const createBattleMove = (name: string): BattleMove => {
  const skill = getSkillByName(name);
  if (!skill) {
    return {
      id: `unknown-${name}`,
      name,
      type: 'normal',
      category: 'physical',
      power: 40,
      accuracy: 100,
      priority: 0,
      pp: 35,
      remainingPp: 35,
      effects: [],
      handler: undefined,
    };
  }

  const generated = getSkillHandlerByName(skill.name);
  return {
    id: skill.id,
    name: skill.name,
    type: skill.type,
    category: skill.category,
    power: skill.power,
    accuracy: skill.accuracy,
    priority: skill.priority,
    pp: skill.pp,
    remainingPp: skill.pp,
    effects: buildEffects(skill),
    handler: generated?.handler,
  };
};
