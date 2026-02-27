import type { SkillHandler } from '../runtime-api';

// 볼부비부비: 위력 20, 100% 확률로 마비
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(20, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('paralysis', context.targetSide, 100);
  }
};

export default handler;
