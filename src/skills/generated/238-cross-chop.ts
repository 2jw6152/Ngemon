import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 80);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 크로스촙! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 크로스촙!`);
  }
};

export default handler;
