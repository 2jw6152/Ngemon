import type { SkillHandler } from '../runtime-api';

// 플라워힐: 상대의 HP를 50% 회복한다
const handler: SkillHandler = (context, ops) => {
  ops.heal(context.targetSide, 0.5);
};

export default handler;
