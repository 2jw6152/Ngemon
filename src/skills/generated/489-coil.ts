import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 똬리틀기: Raises the user’s Attack, Defense, and accuracy by one stage...
  ops.changeStatRanks({
  atk: 1,
  def: 1,
  accuracy: 1
});
};

export default handler;
