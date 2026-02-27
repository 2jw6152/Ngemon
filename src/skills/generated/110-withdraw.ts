import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 껍질에숨기: Raises the user’s Defense by one stage....
  ops.changeStatRanks({
  def: 1
});
};

export default handler;
