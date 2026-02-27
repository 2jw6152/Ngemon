import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 애교부리기: Lowers the target’s Attack by two stages....
  ops.changeStatRanks({
  atk: -2
}, 'opponent');
};

export default handler;
