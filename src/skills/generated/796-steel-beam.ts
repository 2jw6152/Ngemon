import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(140, 95);
  if (dealt > 0) {
    ops.log(`${context.user.koName}의 철제광선! ${dealt} 피해`);
  } else {
    ops.log(`${context.user.koName}의 철제광선!`);
  }
};

export default handler;
