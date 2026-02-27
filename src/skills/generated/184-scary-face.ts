import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 겁나는얼굴: Lowers the target’s Speed by two stages....
  ops.changeStatRanks({
  spe: -2
}, 'opponent');
};

export default handler;
