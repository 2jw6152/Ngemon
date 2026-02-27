import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(25, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 본러쉬! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 본러쉬!`);
  }
};

export default handler;
