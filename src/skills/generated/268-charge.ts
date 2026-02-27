import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 충전: Raises the user’s Special Defense by one stage.  User’s Electric moves have doubled power next turn.
  ops.changeStatRanks({
  spd: 1
});
};

export default handler;
