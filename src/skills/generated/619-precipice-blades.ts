import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(120, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 단애의칼! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 단애의칼!`);
  }
};

export default handler;
