import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(60);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 스피드스타! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 스피드스타!`);
  }
};

export default handler;
