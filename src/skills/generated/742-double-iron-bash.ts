import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(60, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 더블펀처! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 더블펀처!`);
  }
};

export default handler;
