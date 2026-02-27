import type { SkillHandler } from '../runtime-api';

// 수면가루: 명중률 75%, 상대를 잠듦 상태로 만든다
const handler: SkillHandler = (context, ops) => {
  ops.applyStatus('sleep', context.targetSide, 100);
};

export default handler;
