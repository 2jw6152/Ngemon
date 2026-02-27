import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(70);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 스마트호른! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 스마트호른!`);
  }
};

export default handler;
