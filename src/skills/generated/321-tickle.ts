import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 간지르기: Lowers the target’s Attack and Defense by one stage....
  ops.changeStatRanks({
  atk: -1,
  def: -1
}, 'opponent');
};

export default handler;
