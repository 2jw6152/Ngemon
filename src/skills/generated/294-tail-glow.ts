import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 반딧불: Raises the user’s Special Attack by three stages....
  ops.changeStatRanks({
  atk: 3,
  spa: 3
});
};

export default handler;
