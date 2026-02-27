import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (context, ops) => {
  const dealt = ops.dealDamage(90, 100);
  if (dealt > 0 && context.target.currentHp > 0) {
    ops.applyStatus('poison', context.targetSide, 30);
  }
};

export default handler;
