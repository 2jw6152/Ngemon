import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(95, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 미스트볼! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 미스트볼!`);
  }
};

export default handler;
