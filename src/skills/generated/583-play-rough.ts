import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(90, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 치근거리기! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 치근거리기!`);
  }
};

export default handler;
