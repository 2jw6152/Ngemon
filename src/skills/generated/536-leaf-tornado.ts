import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(65, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 그래스믹서! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 그래스믹서!`);
  }
};

export default handler;
