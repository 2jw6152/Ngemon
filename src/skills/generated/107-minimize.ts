import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 작아지기: Raises the user’s evasion by two stages....
  ops.changeStatRanks({
  evasion: 2
});
};

export default handler;
