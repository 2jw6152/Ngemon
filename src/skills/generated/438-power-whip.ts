import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(120, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 파워휩! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 파워휩!`);
  }
};

export default handler;
