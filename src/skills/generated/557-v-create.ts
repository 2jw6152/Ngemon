import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // V제너레이트: Lowers the user’s Defense, Special Defense, and Speed by one...
  ops.changeStatRanks({
  spd: -1,
  spe: -1
});
};

export default handler;
