import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(110, 70);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 폭풍! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 폭풍!`);
  }
};

export default handler;
