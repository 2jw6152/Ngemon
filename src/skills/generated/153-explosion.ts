import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(250, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 대폭발! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 대폭발!`);
  }
};

export default handler;
