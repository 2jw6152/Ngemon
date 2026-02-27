import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 그림자분신: Raises the user’s evasion by one stage....
  ops.changeStatRanks({
  evasion: 1
});
};

export default handler;
