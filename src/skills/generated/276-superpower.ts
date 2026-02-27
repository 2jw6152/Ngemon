import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(120, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 엄청난힘! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 엄청난힘!`);
  }
};

export default handler;
