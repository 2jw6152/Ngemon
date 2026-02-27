import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 나비춤: Raises the user’s Special Attack, Special Defense, and Speed...
  ops.changeStatRanks({
  atk: 1,
  spa: 1,
  spd: 1,
  spe: 1
});
};

export default handler;
