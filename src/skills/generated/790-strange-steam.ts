import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(90, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 원더스팀! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 원더스팀!`);
  }
};

export default handler;
