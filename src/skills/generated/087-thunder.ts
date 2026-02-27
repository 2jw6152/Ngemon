import type { SkillHandler } from '../runtime-api';

// 번개: 위력 110, 30% 확률로 마비
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(110, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('paralysis', context.targetSide, 30);
  }
};

export default handler;
