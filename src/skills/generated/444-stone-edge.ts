import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 80);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 스톤에지! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 스톤에지!`);
  }
};

export default handler;
