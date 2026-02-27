import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(25, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 스위프뺨치기! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 스위프뺨치기!`);
  }
};

export default handler;
