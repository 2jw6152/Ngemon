import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 꼬리흔들기: Lowers the target’s Defense by one stage....
  ops.changeStatRanks({
  def: -1
}, 'opponent');
};

export default handler;
