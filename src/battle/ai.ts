import { getTypeMultiplier } from './type-chart';
import { getEffectiveStat } from './ranks';
import type { BattleSession, BattleCommand, BattleMove, BattleSide } from './types';

const getOffensiveStat = (move: BattleMove, attackerAtk: number, attackerSpa: number) =>
  move.category === 'physical' ? attackerAtk : attackerSpa;

const getDefensiveStat = (move: BattleMove, defenderDef: number, defenderSpd: number) =>
  move.category === 'physical' ? defenderDef : defenderSpd;

const evaluateMove = (attacker: { types: string[]; stats: { atk: number; spa: number }; statRanks: { atk: number; spa: number; def: number; spd: number } }, defender: { types: string[]; stats: { def: number; spd: number }; statRanks: { atk: number; spa: number; def: number; spd: number } }, move: BattleMove) => {
  if (move.category === 'status' || !move.power) {
    return 0;
  }
  
  const offensive = getOffensiveStat(move, attacker.stats.atk, attacker.stats.spa);
  const defensive = getDefensiveStat(move, defender.stats.def, defender.stats.spd);
  
  // 랭크 보정 적용
  const effectiveOffensive = move.category === 'physical' 
    ? getEffectiveStat(offensive, attacker.statRanks.atk)
    : getEffectiveStat(offensive, attacker.statRanks.spa);
  
  const effectiveDefensive = move.category === 'physical'
    ? getEffectiveStat(defensive, defender.statRanks.def)
    : getEffectiveStat(defensive, defender.statRanks.spd);
  
  // Battle_Formula.md 기준 데미지 공식 (간소화 버전)
  const step1 = 22; // (50 × 2 ÷ 5) + 2
  const step2 = Math.floor(step1 * move.power * effectiveOffensive / 50);
  const step3 = Math.floor(step2 / Math.max(1, effectiveDefensive));
  const step4 = step3; // Mod1 (화상 등) 미고려
  const step5 = step4 + 2;
  const step6 = step5; // 급소 미고려
  
  // 랜덤수 평균: 92.5 (85~100의 중간)
  const step7 = Math.floor(step6 * 92.5 / 100);
  
  // 자속보정
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;
  const step8 = Math.floor(step7 * stab);
  
  // 타입상성
  const effectiveness = getTypeMultiplier(move.type, defender.types);
  const damage = Math.max(1, Math.floor(step8 * effectiveness));
  
  const accuracy = move.accuracy ?? 100;
  return damage * (accuracy / 100);
};

export const chooseCpuAction = (session: BattleSession): BattleCommand => {
  const opponent = session.snapshot.active.opponent;
  const player = session.snapshot.active.player;
  const availableMoves = opponent.moves.filter((move) => move.remainingPp > 0);

  let bestMove: BattleMove | null = null;
  let bestScore = -Infinity;

  for (const move of availableMoves) {
    const score = evaluateMove(opponent, player, move);
    if (move.category !== 'status' && player.currentHp <= score) {
      // 마무리 가능 시 큰 가중치
      return { kind: 'move', moveId: move.id };
    }
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (!bestMove) {
    return { kind: 'surrender' };
  }

  return {
    kind: 'move',
    moveId: bestMove.id,
  };
};

export const evaluateSwitch = (session: BattleSession, side: BattleSide): BattleCommand | null => {
  if (side !== 'opponent') {
    return null;
  }
  const { player, opponent } = session.snapshot.active;
  const bench = session.snapshot.bench.opponent;
  const availableBench = bench
    .map((pokemon, index) => ({ pokemon, index }))
    .filter(({ pokemon }) => pokemon.currentHp > 0);
  const currentThreat = getTypeMultiplier(player.moves[0]?.type ?? 'normal', opponent.types);
  if (availableBench.length === 0 || currentThreat < 1.5) {
    return null;
  }
  const safeCandidate = availableBench.find(
    ({ pokemon }) => getTypeMultiplier(player.moves[0]?.type ?? 'normal', pokemon.types) <= 1,
  );
  if (!safeCandidate) {
    return null;
  }
  return { kind: 'switch', targetIndex: safeCandidate.index };
};
