import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(50, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 뼈다귀부메랑! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 뼈다귀부메랑!`);
  }
};

export default handler;
