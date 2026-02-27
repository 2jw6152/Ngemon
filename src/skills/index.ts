import { findGeneratedSkill } from './generated/index';
import type { SkillDefinition } from './runtime-api';

export const getSkillHandlerByName = (name: string): SkillDefinition | null => findGeneratedSkill(name);
