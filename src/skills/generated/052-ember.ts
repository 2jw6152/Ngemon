import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(40, 100);
  // 10% 확률로 화상 상태 부여
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('burn', context.targetSide, 10);
  }
};

export default handler;
