import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(20, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 가시대포! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 가시대포!`);
  }
};

export default handler;
