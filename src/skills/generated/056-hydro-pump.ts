import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(110, 80);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 하이드로펌프! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 하이드로펌프!`);
  }
};

export default handler;
