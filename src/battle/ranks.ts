import type { StatRank, BattlePokemon } from './types';

// 스탯 랭크 정보 (export)
export interface StatRanks {
  atk: StatRank;
  def: StatRank;
  spa: StatRank;
  spd: StatRank;
  spe: StatRank;
  accuracy: StatRank;
  evasion: StatRank;
}

// 기본 랭크 (모두 0)
export const DEFAULT_STAT_RANKS: StatRanks = {
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
  accuracy: 0,
  evasion: 0,
};

// 랭크 변화 범위 제한 (-6 ~ +6)
export const clampRank = (rank: number): StatRank => {
  return Math.max(-6, Math.min(6, rank)) as StatRank;
};

// 랭크 변화 적용
export const changeStatRank = (currentRank: StatRank, change: number): StatRank => {
  const newRank = currentRank + change;
  return clampRank(newRank);
};

// 랭크에 따른 스탯 보정 계산
// 기본 능력치: (2 + max(0,x) / 2 - min(0,x))
// 명중률/회피율: (3 + max(0,x) / 3 - min(0,x))
export const getStatMultiplier = (rank: StatRank, isAccuracyOrEvasion: boolean = false): number => {
  if (rank === 0) return 1.0;
  
  if (isAccuracyOrEvasion) {
    // 명중률/회피율: (3 + max(0,x) / 3 - min(0,x))
    const numerator = 3 + Math.max(0, rank) / 3 - Math.min(0, rank);
    return numerator / 3;
  } else {
    // 기본 능력치: (2 + max(0,x) / 2 - min(0,x))
    const numerator = 2 + Math.max(0, rank) / 2 - Math.min(0, rank);
    return numerator / 2;
  }
};

// 랭크 변화 메시지 생성
export const getRankChangeMessage = (
  pokemonName: string,
  statName: string,
  oldRank: StatRank,
  newRank: StatRank
): string => {
  const change = newRank - oldRank;
  const absChange = Math.abs(change);
  
  // 이미 최대/최소 랭크인 경우
  if (change > 0 && newRank === 6) {
    return `${pokemonName}의 ${statName}는 더 이상 올릴 수 없다!`;
  }
  if (change < 0 && newRank === -6) {
    return `${pokemonName}의 ${statName}는 더 이상 떨어지지 않는다!`;
  }
  
  // 변화량에 따른 메시지
  if (absChange === 1) {
    return change > 0 
      ? `${pokemonName}의 ${statName}이 올라갔다!`
      : `${pokemonName}의 ${statName}이 떨어졌다!`;
  } else if (absChange === 2) {
    return change > 0
      ? `${pokemonName}의 ${statName}이 크게 올라갔다!`
      : `${pokemonName}의 ${statName}이 크게 떨어졌다!`;
  } else if (absChange >= 3) {
    return change > 0
      ? `${pokemonName}의 ${statName}이 매우 크게 올라갔다!`
      : `${pokemonName}의 ${statName}이 매우 크게 떨어졌다!`;
  }
  
  return `${pokemonName}의 ${statName}이 변화했다!`;
};

// 스탯 이름 매핑
export const STAT_NAMES: Record<keyof StatRanks, string> = {
  atk: '공격',
  def: '방어',
  spa: '특수공격',
  spd: '특수방어',
  spe: '스피드',
  accuracy: '명중률',
  evasion: '회피율',
};

// 랭크 변화 적용 (여러 스탯 동시)
export const applyStatRankChanges = (
  pokemon: BattlePokemon,
  changes: Partial<Record<keyof StatRanks, number>>
): { success: boolean; messages: string[] } => {
  const messages: string[] = [];
  let hasChanges = false;
  
  for (const [stat, change] of Object.entries(changes)) {
    if (change === 0) continue;
    
    const statKey = stat as keyof StatRanks;
    const oldRank = pokemon.statRanks[statKey];
    const newRank = changeStatRank(oldRank, change);
    
    if (oldRank !== newRank) {
      pokemon.statRanks[statKey] = newRank;
      const statName = STAT_NAMES[statKey];
      const message = getRankChangeMessage(pokemon.koName, statName, oldRank, newRank);
      messages.push(message);
      hasChanges = true;
    }
  }
  
  return { success: hasChanges, messages };
};

// 실제 스탯 계산 (랭크 보정 적용)
export const getEffectiveStat = (
  baseStat: number,
  rank: StatRank,
  isAccuracyOrEvasion: boolean = false
): number => {
  const multiplier = getStatMultiplier(rank, isAccuracyOrEvasion);
  return Math.floor(baseStat * multiplier);
};
