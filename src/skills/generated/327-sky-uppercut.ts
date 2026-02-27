import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(85, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 스카이업퍼! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 스카이업퍼!`);
  }
};

export default handler;
