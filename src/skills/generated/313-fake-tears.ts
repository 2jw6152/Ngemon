import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 거짓울음: Lowers the target’s Special Defense by two stages....
  ops.changeStatRanks({
  spd: -2
}, 'opponent');
};

export default handler;
