import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(120, 75);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 메가톤킥! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 메가톤킥!`);
  }
};

export default handler;
