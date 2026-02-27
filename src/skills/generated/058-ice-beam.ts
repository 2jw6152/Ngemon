import type { SkillHandler } from '../runtime-api';

// 냉동빔: 위력 90, 10% 확률로 얼음
const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(90, 100);
  // 데미지를 입히고, 대상이 살아있을 때만 상태 이상 부여
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('freeze', context.targetSide, 10);
  }
};

export default handler;
