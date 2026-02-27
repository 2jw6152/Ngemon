import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(35, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 바다회오리! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 바다회오리!`);
  }
};

export default handler;
