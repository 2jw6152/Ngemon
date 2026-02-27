import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 75);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 마그마스톰! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 마그마스톰!`);
  }
};

export default handler;
