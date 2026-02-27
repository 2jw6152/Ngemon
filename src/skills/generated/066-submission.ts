import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(80, 80);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 지옥의바퀴! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 지옥의바퀴!`);
  }
};

export default handler;
