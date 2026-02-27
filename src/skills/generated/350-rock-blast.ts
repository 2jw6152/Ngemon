import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(25, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 락블레스트! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 락블레스트!`);
  }
};

export default handler;
