import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 다른차원러시! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 다른차원러시!`);
  }
};

export default handler;
