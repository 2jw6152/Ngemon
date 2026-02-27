import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(65, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 뼈다귀치기! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 뼈다귀치기!`);
  }
};

export default handler;
