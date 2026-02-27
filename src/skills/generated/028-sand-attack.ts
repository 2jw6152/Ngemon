import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 모래뿌리기: Lowers the target's accuracy by one stage....
  ops.changeStatRanks({
  accuracy: -1
}, 'opponent');
};

export default handler;
