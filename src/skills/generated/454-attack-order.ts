import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(90, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 공격지령! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 공격지령!`);
  }
};

export default handler;
