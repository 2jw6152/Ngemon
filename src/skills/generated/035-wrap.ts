import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(15, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 김밥말이! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 김밥말이!`);
  }
};

export default handler;
