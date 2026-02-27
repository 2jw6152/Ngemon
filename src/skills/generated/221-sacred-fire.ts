import type { SkillHandler } from '../runtime-api';

// 성스러운불꽃: 위력 100, 50% 확률로 화상
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('burn', context.targetSide, 50);
  }
};

export default handler;
