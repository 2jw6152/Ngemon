import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(200, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 자폭! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 자폭!`);
  }
};

export default handler;
