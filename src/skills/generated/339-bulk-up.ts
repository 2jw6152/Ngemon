import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 벌크업: Raises the user’s Attack and Defense by one stage....
  ops.changeStatRanks({
  atk: 1,
  def: 1
});
};

export default handler;
