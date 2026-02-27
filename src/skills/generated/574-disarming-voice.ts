import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(40);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 차밍보이스! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 차밍보이스!`);
  }
};

export default handler;
