import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(65, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 거품광선! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 거품광선!`);
  }
};

export default handler;
