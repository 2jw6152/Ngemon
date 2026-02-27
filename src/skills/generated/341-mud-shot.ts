import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(55, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 머드숏! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 머드숏!`);
  }
};

export default handler;
