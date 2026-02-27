import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 명상: Raises the user’s Special Attack and Special Defense by one ...
  ops.changeStatRanks({
  atk: 1,
  spa: 1,
  spd: 1
});
};

export default handler;
