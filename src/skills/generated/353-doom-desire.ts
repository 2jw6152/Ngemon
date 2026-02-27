import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(140, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 파멸의소원! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 파멸의소원!`);
  }
};

export default handler;
