import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 친해지기: Lowers the target’s Attack by one stage....
  ops.changeStatRanks({
  atk: -1
}, 'opponent');
};

export default handler;
