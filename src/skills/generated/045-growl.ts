import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 울음소리: Lowers the target’s Attack by one stage....
  ops.changeStatRanks({
  atk: -1
}, 'opponent');
};

export default handler;
