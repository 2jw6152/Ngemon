import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(80, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 트라이어택! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 트라이어택!`);
  }
};

export default handler;
