import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(50, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 기어소서! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 기어소서!`);
  }
};

export default handler;
