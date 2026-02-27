import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(100, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 에어로블라스트! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 에어로블라스트!`);
  }
};

export default handler;
