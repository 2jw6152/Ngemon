import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 달콤한향기: Lowers the target’s evasion by one stage....
  ops.changeStatRanks({
  evasion: -1
}, 'opponent');
};

export default handler;
