import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 코어퍼니셔! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 코어퍼니셔!`);
  }
};

export default handler;
