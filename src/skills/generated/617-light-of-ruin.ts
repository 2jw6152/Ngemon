import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(140, 90);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 파멸의빛! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 파멸의빛!`);
  }
};

export default handler;
