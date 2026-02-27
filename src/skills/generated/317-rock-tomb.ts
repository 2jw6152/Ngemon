import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(60, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 암석봉인! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 암석봉인!`);
  }
};

export default handler;
