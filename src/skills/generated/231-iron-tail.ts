import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 75);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 아이언테일! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 아이언테일!`);
  }
};

export default handler;
