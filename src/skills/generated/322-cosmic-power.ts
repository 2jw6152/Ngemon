import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 코스믹파워: Raises the user’s Defense and Special Defense by one stage....
  ops.changeStatRanks({
  spd: 1
});
};

export default handler;
