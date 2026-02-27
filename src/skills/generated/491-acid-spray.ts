import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 애시드봄: Lowers the target’s Special Defense by two stages....
  ops.changeStatRanks({
  spd: -2
}, 'opponent');
};

export default handler;
