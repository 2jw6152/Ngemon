import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(85, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 뛰어오르다! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 뛰어오르다!`);
  }
};

export default handler;
