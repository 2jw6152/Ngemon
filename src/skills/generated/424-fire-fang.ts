import type { SkillHandler } from '../runtime-api';

// 불꽃니: 위력 65, 10% 확률로 화상
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(65, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('burn', context.targetSide, 10);
  }
};

export default handler;
