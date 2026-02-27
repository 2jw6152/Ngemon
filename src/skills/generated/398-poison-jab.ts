import type { SkillHandler } from '../runtime-api';

// 독찌르기: 위력 80, 30% 확률로 독
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(80, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('poison', context.targetSide, 30);
  }
};

export default handler;
