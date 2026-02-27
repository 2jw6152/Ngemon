import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 고속이동: Raises the user’s Speed by two stages....
  ops.changeStatRanks({
  spe: 2
});
};

export default handler;
