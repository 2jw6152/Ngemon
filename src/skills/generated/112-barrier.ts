import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 배리어: Raises the user’s Defense by two stages....
  ops.changeStatRanks({
  def: 2
});
};

export default handler;
