import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 멀리짖음: Raises the user’s Attack by one stage....
  ops.changeStatRanks({
  atk: 1
});
};

export default handler;
