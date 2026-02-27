import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(130, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 뇌격! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 뇌격!`);
  }
};

export default handler;
