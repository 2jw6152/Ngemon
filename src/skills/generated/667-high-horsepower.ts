import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(95, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 10만마력! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 10만마력!`);
  }
};

export default handler;
