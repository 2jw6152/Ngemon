import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(35, 85);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 껍질끼우기! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 껍질끼우기!`);
  }
};

export default handler;
