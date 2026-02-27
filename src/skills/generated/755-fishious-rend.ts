import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(85, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 아가미물기! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 아가미물기!`);
  }
};

export default handler;
