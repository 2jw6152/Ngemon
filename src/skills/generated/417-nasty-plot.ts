import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 나쁜음모: Raises the user's Special Attack by two stages....
  ops.changeStatRanks({
  spa: 2
});
};

export default handler;
