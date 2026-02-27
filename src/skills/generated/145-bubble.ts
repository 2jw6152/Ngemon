import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(40, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 거품! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 거품!`);
  }
};

export default handler;
