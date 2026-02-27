import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 50);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 연옥! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 연옥!`);
  }
};

export default handler;
