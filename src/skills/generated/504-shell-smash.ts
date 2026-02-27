import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 껍질깨기: Raises user’s Attack, Special Attack, and Speed by two stage...
  ops.changeStatRanks({
  atk: 1,
  spa: 1,
  spd: 1,
  spe: 1
});
};

export default handler;
