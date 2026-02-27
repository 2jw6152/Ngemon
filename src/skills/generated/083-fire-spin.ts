import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(35, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 회오리불꽃! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 회오리불꽃!`);
  }
};

export default handler;
