import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(75, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 옛노래! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 옛노래!`);
  }
};

export default handler;
