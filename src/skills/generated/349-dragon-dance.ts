import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 용의춤: Raises the user’s Attack and Speed by one stage....
  ops.changeStatRanks({
  atk: 1,
  spe: 1
});
};

export default handler;
