import type { SkillHandler } from '../runtime-api';

const handler: SkillHandler = (_context, ops) => {
  // 인파이트: Lowers the user’s Defense and Special Defense by one stage after inflicting damage.
  // TODO: 데미지를 입힌 후에 적용되어야 함 (현재는 즉시 적용됨)
  ops.changeStatRanks({
  spd: -1
});
};

export default handler;
