import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 칼춤: Raises the user’s Attack by two stages....
  ops.changeStatRanks({
  atk: 2
});
};

export default handler;
