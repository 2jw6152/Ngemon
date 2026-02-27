import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(160, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 프리즘레이저! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 프리즘레이저!`);
  }
};

export default handler;
