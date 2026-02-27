import type { SkillHandler } from '../runtime-api';

// 전기자석파: 명중률 90%, 상대를 마비 상태로 만든다
const handler: SkillHandler = (context, ops) => {
  ops.applyStatus('paralysis', context.targetSide, 100);
};

export default handler;
