import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(80);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 다른차원홀! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 다른차원홀!`);
  }
};

export default handler;
