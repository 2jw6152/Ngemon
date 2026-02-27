import type { SkillHandler } from '../runtime-api';

// HP회복: 자신의 HP를 50% 회복한다
const handler: SkillHandler = (context, ops) => {
  ops.heal(context.userSide, 0.5);
};

export default handler;
