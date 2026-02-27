import type { SkillHandler } from '../runtime-api';

// 블레이즈킥: 위력 85, 10% 확률로 화상
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(85, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('burn', context.targetSide, 10);
  }
};

export default handler;
