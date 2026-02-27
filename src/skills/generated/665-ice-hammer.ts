import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 아이스해머: Lowers user’s Speed by one stage....
  ops.changeStatRanks({
  spe: -1
});
};

export default handler;
