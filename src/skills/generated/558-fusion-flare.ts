import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 크로스플레임! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 크로스플레임!`);
  }
};

export default handler;
