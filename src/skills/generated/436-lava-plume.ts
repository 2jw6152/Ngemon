import type { SkillHandler } from '../runtime-api';

// 분연: 위력 80, 30% 확률로 화상
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(80, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('burn', context.targetSide, 30);
  }
};

export default handler;
