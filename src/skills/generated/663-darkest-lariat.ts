import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(85, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 DD래리어트! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 DD래리어트!`);
  }
};

export default handler;
