import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(65, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 진흙폭탄! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 진흙폭탄!`);
  }
};

export default handler;
