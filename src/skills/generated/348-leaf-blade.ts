import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(90, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 리프블레이드! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 리프블레이드!`);
  }
};

export default handler;
