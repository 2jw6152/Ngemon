import type { SkillHandler } from '../runtime-api';

// 오물공격: 위력 65, 30% 확률로 독
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(65, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('poison', context.targetSide, 30);
  }
};

export default handler;
