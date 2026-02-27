import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 망각술: Raises the user’s Special Defense by two stages....
  ops.changeStatRanks({
  spd: 2
});
};

export default handler;
