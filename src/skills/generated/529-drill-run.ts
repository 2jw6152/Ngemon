import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(80, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 드릴라이너! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 드릴라이너!`);
  }
};

export default handler;
