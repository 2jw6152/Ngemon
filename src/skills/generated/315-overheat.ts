import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 오버히트: Lowers the user’s Special Attack by two stages after inflicting damage.
  // TODO: 데미지를 입힌 후에 적용되어야 함 (현재는 즉시 적용됨)
  ops.changeStatRanks({
  spa: -2
});
};

export default handler;
