import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 부르짖기: Lowers the target’s Attack and Special Attack by one stage....
  ops.changeStatRanks({
  atk: -1,
  spa: -1
}, 'opponent');
};

export default handler;
