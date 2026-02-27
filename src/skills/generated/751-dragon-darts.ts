import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(50, 100);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 드래곤애로! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 드래곤애로!`);
  }
};

export default handler;
