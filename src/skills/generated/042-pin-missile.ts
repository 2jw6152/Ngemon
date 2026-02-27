import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(25, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 바늘미사일! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 바늘미사일!`);
  }
};

export default handler;
