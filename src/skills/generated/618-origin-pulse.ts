import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(110, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 근원의파동! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 근원의파동!`);
  }
};

export default handler;
