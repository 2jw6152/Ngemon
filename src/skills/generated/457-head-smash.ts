import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(150, 80);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 양날박치기! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 양날박치기!`);
  }
};

export default handler;
