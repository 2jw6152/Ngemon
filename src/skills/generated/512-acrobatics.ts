import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(55, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 애크러뱃! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 애크러뱃!`);
  }
};

export default handler;
