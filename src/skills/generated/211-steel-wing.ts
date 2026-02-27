import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(70, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 강철날개! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 강철날개!`);
  }
};

export default handler;
