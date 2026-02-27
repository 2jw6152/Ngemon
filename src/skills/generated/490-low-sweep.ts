import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 로킥: Lowers the target’s Speed by one stage....
  ops.changeStatRanks({
  spe: -1
}, 'opponent');
};

export default handler;
