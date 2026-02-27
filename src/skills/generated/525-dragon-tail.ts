import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(60, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 드래곤테일! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 드래곤테일!`);
  }
};

export default handler;
