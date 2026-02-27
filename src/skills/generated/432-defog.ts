import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 안개제거: Lowers the target’s evasion by one stage.  Removes field eff...
  ops.changeStatRanks({
  evasion: -1
}, 'opponent');
};

export default handler;
