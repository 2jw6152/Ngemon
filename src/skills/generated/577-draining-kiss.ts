import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(50, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 드레인키스! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 드레인키스!`);
  }
};

export default handler;
