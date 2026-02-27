import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(75, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 브레이크크루! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 브레이크크루!`);
  }
};

export default handler;
