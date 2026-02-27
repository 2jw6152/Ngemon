import type { SkillHandler } from '../runtime-api';

// 화염방사: 위력 90, 10% 확률로 화상
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(90, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('burn', context.targetSide, 10);
  }
};

export default handler;
