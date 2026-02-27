import type { SkillHandler } from '../runtime-api';

// 도깨비불: 명중률 85%, 상대를 화상 상태로 만든다
const handler: SkillHandler = (context, ops) => {
  ops.applyStatus('burn', context.targetSide, 100);
};

export default handler;
