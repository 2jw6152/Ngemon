import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 괴전파: Lowers the target’s Special Attack by two stages....
  ops.changeStatRanks({
  atk: -2,
  spa: -2
}, 'opponent');
};

export default handler;
