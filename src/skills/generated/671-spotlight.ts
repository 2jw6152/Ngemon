import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  ops.log('기술 스포트라이트 은(는) 아직 수동 구현이 필요합니다.');
};

export default handler;
