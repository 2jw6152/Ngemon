import type { SkillHandler } from '../runtime-api';

// 독가스: 명중률 55%, 상대를 독 상태로 만든다
const handler: SkillHandler = (context, ops) => {
  ops.applyStatus('poison', context.targetSide, 100);
};

export default handler;
