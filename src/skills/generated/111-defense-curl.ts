import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 웅크리기: Raises user’s Defense by one stage....
  ops.changeStatRanks({
  def: 1
});
};

export default handler;
