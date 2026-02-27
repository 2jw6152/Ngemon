import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 크로스썬더! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 크로스썬더!`);
  }
};

export default handler;
