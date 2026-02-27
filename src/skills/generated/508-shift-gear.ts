import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 기어체인지: Raises the user’s Attack by one stage and its Speed by two s...
  ops.changeStatRanks({
  atk: 1,
  spe: 2
});
};

export default handler;
