import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(150, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 암석포! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 암석포!`);
  }
};

export default handler;
