import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 코튼가드: Raises the user’s Defense by three stages....
  ops.changeStatRanks({
  def: 3
});
};

export default handler;
