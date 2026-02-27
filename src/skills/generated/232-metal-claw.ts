import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(50, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 메탈크로우! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 메탈크로우!`);
  }
};

export default handler;
