import { loadSpeciesCatalog } from './catalog';
import { choice, choiceWeighted, getDefaultRng, uniformInt } from './rng';

const FALLBACK_MOVES = ['몸통박치기', '할퀴기', '전광석화', '바둥바둥'];

export interface DrawnPokemon {
  speciesId: string;
  koName: string;
  enName: string;
  spriteKey: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
    total: number;
  };
  types: string[];
  moves: string[];
}

const pickMoves = (learnset: string[]): string[] => {
  const rng = getDefaultRng();
  if (!learnset.length) {
    return FALLBACK_MOVES.slice(0, 4);
  }
  const pool = [...new Set(learnset)];
  if (pool.length <= 4) {
    return pool;
  }
  const moves: string[] = [];
  while (moves.length < 4 && pool.length > 0) {
    const index = uniformInt(pool.length, rng);
    moves.push(pool.splice(index, 1)[0]);
  }
  return moves;
};

export type DrawTier = 'random' | 'monster' | 'super' | 'hyper';

const TIER_RANGES = {
  monster: { min: 0, max: 400 },
  super: { min: 401, max: 500 },
  hyper: { min: 501, max: 9999 },
};

// 종족값(Base Stat)을 실제 스탯으로 변환
const calculateStat = (baseStat: number, isHp: boolean): number => {
  // Battle_Formula.md 기준
  // HP: floor((2a + 115) / 2 + 10)
  // 기타: floor((2a + 115) / 2 + 5)
  const base = Math.floor((2 * baseStat + 115) / 2);
  return isHp ? base + 10 : base + 5;
};

export const drawRandomPokemon = async (tier: DrawTier = 'random'): Promise<DrawnPokemon> => {
  const rng = getDefaultRng();
  const catalog = await loadSpeciesCatalog();
  
  let pool = catalog;
  if (tier !== 'random') {
    const range = TIER_RANGES[tier];
    pool = pool.filter((s) => s.stats.total >= range.min && s.stats.total <= range.max);
  }
  
  if (pool.length === 0) {
    throw new Error(`No species available for tier=${tier}`);
  }
  
  const species = choice(pool, rng);
  
  // 종족값을 실제 스탯으로 변환
  const calculatedStats = {
    hp: calculateStat(species.stats.hp, true),
    atk: calculateStat(species.stats.atk, false),
    def: calculateStat(species.stats.def, false),
    spa: calculateStat(species.stats.spa, false),
    spd: calculateStat(species.stats.spd, false),
    spe: calculateStat(species.stats.spe, false),
    total: species.stats.total, // total은 종족값 합계 유지
  };
  
  return {
    speciesId: species.slug,
    koName: species.koName,
    enName: species.enName,
    spriteKey: species.enName,
    stats: calculatedStats,
    types: species.types,
    moves: pickMoves(species.learnset),
  };
};

export const drawShopRandomPokemonWeighted = async (): Promise<DrawnPokemon> => {
  const rng = getDefaultRng();
  const pool = await loadSpeciesCatalog();
  if (!pool.length) {
    throw new Error('Species catalog is empty');
  }

  const maxTotal = Math.max(...pool.map((s) => s.stats.total ?? 0), 1);
  const weights = pool.map((s) => {
    const total = Math.max(0, s.stats.total ?? 0);
    // 총 종족값이 높을수록 확률을 낮추기 위해, "남은 거리" 기반 가중치를 사용한다.
    // (maxTotal - total + 1): total이 높을수록 weight가 작아짐.
    return Math.max(1, maxTotal - total + 1);
  });

  const species = choiceWeighted(pool, weights, rng);

  const calculatedStats = {
    hp: calculateStat(species.stats.hp, true),
    atk: calculateStat(species.stats.atk, false),
    def: calculateStat(species.stats.def, false),
    spa: calculateStat(species.stats.spa, false),
    spd: calculateStat(species.stats.spd, false),
    spe: calculateStat(species.stats.spe, false),
    total: species.stats.total,
  };

  return {
    speciesId: species.slug,
    koName: species.koName,
    enName: species.enName,
    spriteKey: species.enName,
    stats: calculatedStats,
    types: species.types,
    moves: pickMoves(species.learnset),
  };
};

export const drawSuperPack = async (): Promise<DrawnPokemon[]> => {
  const rng = getDefaultRng();
  const pool = await loadSpeciesCatalog();
  if (!pool.length) {
    throw new Error('Species catalog is empty');
  }

  const results: DrawnPokemon[] = [];

  // 1~4번째: 확률 변동 없이 균등
  for (let i = 0; i < 4; i += 1) {
    const species = choice(pool, rng);
    const calculatedStats = {
      hp: calculateStat(species.stats.hp, true),
      atk: calculateStat(species.stats.atk, false),
      def: calculateStat(species.stats.def, false),
      spa: calculateStat(species.stats.spa, false),
      spd: calculateStat(species.stats.spd, false),
      spe: calculateStat(species.stats.spe, false),
      total: species.stats.total,
    };
    results.push({
      speciesId: species.slug,
      koName: species.koName,
      enName: species.enName,
      spriteKey: species.enName,
      stats: calculatedStats,
      types: species.types,
      moves: pickMoves(species.learnset),
    });
  }

  // 5번째: 종족값 총합 500+ 확정 (균등)
  let pool500 = pool.filter((s) => (s.stats.total ?? 0) >= 500);
  if (pool500.length === 0) {
    pool500 = pool;
  }
  const guaranteed = choice(pool500, rng);
  const guaranteedStats = {
    hp: calculateStat(guaranteed.stats.hp, true),
    atk: calculateStat(guaranteed.stats.atk, false),
    def: calculateStat(guaranteed.stats.def, false),
    spa: calculateStat(guaranteed.stats.spa, false),
    spd: calculateStat(guaranteed.stats.spd, false),
    spe: calculateStat(guaranteed.stats.spe, false),
    total: guaranteed.stats.total,
  };
  results.push({
    speciesId: guaranteed.slug,
    koName: guaranteed.koName,
    enName: guaranteed.enName,
    spriteKey: guaranteed.enName,
    stats: guaranteedStats,
    types: guaranteed.types,
    moves: pickMoves(guaranteed.learnset),
  });

  return results;
};
