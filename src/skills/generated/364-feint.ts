import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(30, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 페인트! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 페인트!`);
  }
};

export default handler;
