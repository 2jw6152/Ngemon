import type { BattleSnapshot, BattleSide, BattleEvent, MajorStatus } from './types';
import type { SkillContext, SkillOps } from '../skills/runtime-api';
import { getTypeMultiplier } from './type-chart';
import { uniform } from '../utils/rng';
import { tryApplyStatus, getStatusInflictMessage, getAttackMultiplierFromBurn } from './status';
import { applyStatRankChanges, type StatRanks, getEffectiveStat } from './ranks';

// const makeLogEntry = (side: BattleLogEntry['side'], message: string): BattleLogEntry => ({
//   id: crypto.randomUUID(),
//   side,
//   message,
//   timestamp: Date.now(),
// });

export const createSkillOps =
  (snapshot: BattleSnapshot) =>
  (context: SkillContext): SkillOps => ({
    dealDamage: (basePower, accuracy) => {
      const attacker = context.user;
      const defender = context.target;

      // 명중률은 엔진에서 공통 처리하지만, 스킬별로 별도 명중률을 쓰는 경우를 대비해 인자를 유지한다.
      void accuracy;
      
      // Battle_Formula.md 기준 데미지 공식
      // 데미지 = ((((((((50 × 2 ÷ 5) + 2) × 위력 × 특수공격 ÷ 50) ÷ 특수방어) × Mod1) + 2) × [급소] × 랜덤수 ÷ 100) × 자속보정 × 타입상성1 × 타입상성2)
      
      const offensive = context.move.category === 'physical' ? attacker.stats.atk : attacker.stats.spa;
      const defensive = context.move.category === 'physical' ? defender.stats.def : defender.stats.spd;
      
      // 랭크 보정 적용
      const effectiveOffensive = context.move.category === 'physical' 
        ? getEffectiveStat(offensive, attacker.statRanks.atk)
        : getEffectiveStat(offensive, attacker.statRanks.spa);
      
      const effectiveDefensive = context.move.category === 'physical'
        ? getEffectiveStat(defensive, defender.statRanks.def)
        : getEffectiveStat(defensive, defender.statRanks.spd);
      
      // 1단계: (50 × 2 ÷ 5) + 2 = 22
      const step1 = 22;
      
      // 2단계: 22 × 위력 × 공격력 ÷ 50
      const step2 = Math.floor(step1 * basePower * effectiveOffensive / 50);
      
      // 3단계: step2 ÷ 방어력
      const step3 = Math.floor(step2 / Math.max(1, effectiveDefensive));
      
      // 4단계: step3 × Mod1 (화상 보정)
      const mod1 = context.move.category === 'physical' ? getAttackMultiplierFromBurn(attacker) : 1.0;
      const step4 = Math.floor(step3 * mod1);
      
      // 5단계: step4 + 2
      const step5 = step4 + 2;
      
      // 6단계: step5 × 급소 (현재 급소 미구현이므로 1)
      const criticalMultiplier = 1;
      const step6 = Math.floor(step5 * criticalMultiplier);
      
      // 7단계: step6 × 랜덤수 ÷ 100
      // 랜덤수 = floor(((217 ~ 255) × 100) ÷ 255) = 85 ~ 100
      const randomFactor = Math.floor((Math.floor(217 + uniform() * 39) * 100) / 255);
      const step7 = Math.floor(step6 * randomFactor / 100);
      
      // 8단계: step7 × 자속보정
      const stab = attacker.types.includes(context.move.type) ? 1.5 : 1;
      const step8 = Math.floor(step7 * stab);
      
      // 9단계: step8 × 타입상성
      const effectiveness = getTypeMultiplier(context.move.type, defender.types);
      const damage = Math.max(1, Math.floor(step8 * effectiveness));
      
      // 엔진에서 즉시 HP를 갱신하고, 이벤트는 UI 연출용으로만 사용한다
      defender.currentHp = Math.max(0, defender.currentHp - damage);
      
      // HP 변경을 이벤트로도 기록 (UI 재생용)
      const damageEvent: BattleEvent = {
        id: crypto.randomUUID(),
        kind: 'damage',
        targetSide: context.targetSide,
        targetId: defender.instanceId,
        amount: damage,
        timestamp: Date.now(),
        source: 'move', // 기술로 인한 데미지
      };
      
      snapshot.events.push(damageEvent);
      // 데미지/쓰러짐 로그는 엔진에서 일괄 생성한다
      
      return damage;
    },
    applyStatus: (status: MajorStatus, targetSide?: BattleSide, chance: number = 100) => {
      const target = targetSide === context.userSide ? context.user : 
                     targetSide === context.targetSide ? context.target : context.target;
      
      const success = tryApplyStatus(target, status, chance);
      
      if (success) {
        const message = getStatusInflictMessage(target.koName, status);
        snapshot.log.push({
          id: crypto.randomUUID(),
          side: 'system',
          message,
          timestamp: Date.now(),
        });
      }
      
      return success;
    },
    changeStatRanks: (changes: Partial<Record<keyof StatRanks, number>>, targetSide?: BattleSide) => {
      const target = targetSide === context.userSide ? context.user : 
                     targetSide === context.targetSide ? context.target : context.target;
      
      const result = applyStatRankChanges(target, changes);
      
      // 랭크 변화 메시지들을 로그에 추가
      result.messages.forEach(message => {
        snapshot.log.push({ 
          id: crypto.randomUUID(), 
          side: 'system', 
          message, 
          timestamp: Date.now() 
        });
      });
      
      return result.success;
    },
    heal: (targetSide: BattleSide, ratio: number) => {
      const target = targetSide === context.userSide ? context.user : context.target;
      const amount = Math.round(target.stats.hp * ratio);
      const actualHeal = Math.min(target.stats.hp - target.currentHp, amount);
      target.currentHp = Math.min(target.stats.hp, target.currentHp + amount);
      
      // 회복 로그 추가
      if (actualHeal > 0) {
        snapshot.log.push({
          id: crypto.randomUUID(),
          side: 'system',
          message: `${target.koName}의 HP가 회복됐다!`,
          timestamp: Date.now(),
        });
      }
      
      return amount;
    },
    log: (message: string) => {
      void message;
      // 스킬에서의 로그는 엔진에서 일괄 관리하므로 무시
      // snapshot.log.push(makeLogEntry(context.userSide, message));
    },
    rng: uniform,
  });
