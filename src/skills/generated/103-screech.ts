import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 싫은소리: Lowers the target’s Defense by two stages....
  ops.changeStatRanks({
  def: -2
}, 'opponent');
};

export default handler;
