import type { SkillHandler } from '../runtime-api';

// 눈보라: 위력 110, 10% 확률로 얼음
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(110, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('freeze', context.targetSide, 10);
  }
};

export default handler;
