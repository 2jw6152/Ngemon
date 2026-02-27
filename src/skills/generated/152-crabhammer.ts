import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 찝게햄머! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 찝게햄머!`);
  }
};

export default handler;
