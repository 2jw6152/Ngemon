import type { SkillHandler } from '../runtime-api';

// 뱀눈초리: 상대를 마비 상태로 만든다
const handler: SkillHandler = (context, ops) => {
  ops.applyStatus('paralysis', context.targetSide, 100);
};

export default handler;
