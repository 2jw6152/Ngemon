import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(15, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 손바닥치기! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 손바닥치기!`);
  }
};

export default handler;
