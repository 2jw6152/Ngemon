import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 비밀이야기: Lowers the target’s Special Attack by one stage....
  ops.changeStatRanks({
  atk: -1,
  spa: -1
}, 'opponent');
};

export default handler;
