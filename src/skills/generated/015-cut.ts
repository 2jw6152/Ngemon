import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(50, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 풀베기! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 풀베기!`);
  }
};

export default handler;
