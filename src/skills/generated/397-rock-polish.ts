import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 록커트: Raises the user’s Speed by two stages....
  ops.changeStatRanks({
  spe: 2
});
};

export default handler;
