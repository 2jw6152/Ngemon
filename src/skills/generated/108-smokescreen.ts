import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 연막: Lowers the target’s accuracy by one stage....
  ops.changeStatRanks({
  accuracy: -1
}, 'opponent');
};

export default handler;
