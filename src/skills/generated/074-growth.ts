import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 성장: Raises the user’s Attack and Special Attack by one stage....
  ops.changeStatRanks({
  atk: 1,
  spa: 1
});
};

export default handler;
