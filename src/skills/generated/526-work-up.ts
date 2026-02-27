import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 분발: Raises the user’s Attack and Special Attack by one stage eac...
  ops.changeStatRanks({
  atk: 1,
  spa: 1
});
};

export default handler;
