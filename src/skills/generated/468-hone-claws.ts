import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 손톱갈기: Raises the user’s Attack and accuracy by one stage....
  ops.changeStatRanks({
  atk: 1,
  accuracy: 1
});
};

export default handler;
