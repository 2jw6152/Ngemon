import type { SkillHandler } from '../runtime-api';

// 번개엄니: 위력 65, 10% 확률로 마비
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(65, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('paralysis', context.targetSide, 10);
  }
};

export default handler;
