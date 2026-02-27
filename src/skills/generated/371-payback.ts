import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(50, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 보복! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 보복!`);
  }
};

export default handler;
