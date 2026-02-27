import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(80);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 파동탄! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 파동탄!`);
  }
};

export default handler;
