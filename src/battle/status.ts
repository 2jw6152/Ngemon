import type { BattlePokemon, MajorStatus, BattleSide } from './types';
import { uniform, uniformInt } from '../utils/rng';

// 상태 이상 면역 체크
export const isImmuneToStatus = (pokemon: BattlePokemon, status: MajorStatus): boolean => {
  const types = pokemon.types;
  
  switch (status) {
    case 'poison':
      // 독, 강철 타입은 독 면역
      return types.includes('poison') || types.includes('steel');
    
    case 'burn':
      // 불꽃 타입은 화상 면역
      return types.includes('fire');
    
    case 'paralysis':
      // 땅, 전기 타입은 마비 면역
      return types.includes('ground') || types.includes('electric');
    
    case 'freeze':
      // 얼음 타입은 얼음 면역
      return types.includes('ice');
    
    case 'sleep':
      // 잠듦은 타입 면역 없음
      return false;
    
    default:
      return false;
  }
};

// 상태 이상 부여 시도
export const tryApplyStatus = (
  pokemon: BattlePokemon,
  status: MajorStatus,
  chance: number = 100
): boolean => {
  // 이미 상태 이상이 있으면 실패
  if (pokemon.status) {
    return false;
  }
  
  // 면역 체크
  if (isImmuneToStatus(pokemon, status)) {
    return false;
  }
  
  // 확률 체크
  if (uniform() * 100 > chance) {
    return false;
  }
  
  // 상태 이상 부여
  if (status === 'sleep') {
    // 잠듦: 1-3턴
    pokemon.status = {
      type: 'sleep',
      turnsRemaining: uniformInt(3) + 1,
    };
  } else {
    pokemon.status = {
      type: status
    };
  }
  
  return true;
};

// 혼란 부여 시도 (1~4턴)
export const tryApplyConfusion = (
  pokemon: BattlePokemon,
  chance: number = 100
): boolean => {
  if (pokemon.volatileStatus) {
    return false;
  }
  if (uniform() * 100 > chance) {
    return false;
  }
  pokemon.volatileStatus = {
    type: 'confusion',
    turnsRemaining: uniformInt(4) + 1,
  };
  return true;
};

// 상태 이상 메시지 생성
export const getStatusInflictMessage = (pokemonName: string, status: MajorStatus): string => {
  switch (status) {
    case 'poison':
      return `${pokemonName}의 몸에 독이 퍼졌다!`;
    case 'burn':
      return `${pokemonName}은 화상을 입었다!`;
    case 'paralysis':
      return `${pokemonName}은 마비되어 기술이 나오기 어려워졌다!`;
    case 'sleep':
      return `${pokemonName}은 잠들어 버렸다!`;
    case 'freeze':
      return `${pokemonName}은 얼어붙었다!`;
  }
};

// 턴 종료 시 상태 이상 데미지 처리 (HP는 즉시 감소시키지 않음)
export const applyEndOfTurnStatusDamage = (
  pokemon: BattlePokemon,
  side: BattleSide
): { damage: number; message?: string } => {
  void side;
  if (!pokemon.status) {
    return { damage: 0 };
  }
  
  const maxHp = pokemon.stats.hp;
  let damage = 0;
  let message = '';
  
  switch (pokemon.status.type) {
    case 'poison':
      // 최대 HP의 1/8
      damage = Math.max(1, Math.floor(maxHp / 8));
      message = `${pokemon.koName}은 독에 의한 데미지를 입었다!`;
      break;
    
    case 'burn':
      // 최대 HP의 1/16
      damage = Math.max(1, Math.floor(maxHp / 16));
      message = `${pokemon.koName}은 화상 데미지를 입었다!`;
      break;
    
    default:
      // 다른 상태 이상은 턴 종료 데미지 없음
      break;
  }
  
  return { damage, message };
};

// 행동 전 상태 이상 체크 (행동 가능 여부)
export const checkStatusBeforeAction = (
  pokemon: BattlePokemon
): { canAct: boolean; message?: string; wakeUp?: boolean; thaw?: boolean } => {
  if (!pokemon.status) {
    return { canAct: true };
  }
  
  switch (pokemon.status.type) {
    case 'paralysis':
      // 25% 확률로 행동 불가
      if (uniform() < 0.25) {
        return {
          canAct: false,
          message: `${pokemon.koName}은 몸이 저려서 움직일 수 없다!`
        };
      }
      return { canAct: true };
    
    case 'sleep':
      // 턴 카운트 감소
      if (pokemon.status.turnsRemaining && pokemon.status.turnsRemaining > 0) {
        pokemon.status.turnsRemaining--;
        
        if (pokemon.status.turnsRemaining === 0) {
          // 깨어남
          pokemon.status = undefined;
          return {
            canAct: true,
            wakeUp: true,
            message: `${pokemon.koName}은 잠에서 깨어났다!`
          };
        } else {
          // 여전히 잠듦
          return {
            canAct: false,
            message: `${pokemon.koName}은 쿨쿨 잠들어 있다`
          };
        }
      }
      return { canAct: false };
    
    case 'freeze':
      // 20% 확률로 녹음
      if (uniform() < 0.2) {
        pokemon.status = undefined;
        return {
          canAct: true,
          thaw: true,
          message: `${pokemon.koName}의 얼음이 녹았다!`
        };
      }
      return {
        canAct: false,
        message: `${pokemon.koName}은 얼어버려서 움직일 수 없다!`
      };
    
    default:
      // 독, 화상은 행동 제한 없음
      return { canAct: true };
  }
};

// 혼란 상태 체크
export const checkConfusion = (
  pokemon: BattlePokemon
): { confused: boolean; selfHit: boolean; damage?: number; message?: string; followupMessage?: string } => {
  if (!pokemon.volatileStatus || pokemon.volatileStatus.type !== 'confusion') {
    return { confused: false, selfHit: false };
  }

  const remainingTurns = pokemon.volatileStatus.turnsRemaining ?? 1;
  if (remainingTurns <= 0) {
    pokemon.volatileStatus = undefined;
    return {
      confused: false,
      selfHit: false,
      message: `${pokemon.koName}은 혼란에서 벗어났다!`,
    };
  }

  // 이번 턴 혼란 판정을 수행하고, 다음 턴 회복 판정을 위해 카운트를 감소시킨다.
  pokemon.volatileStatus.turnsRemaining = remainingTurns - 1;
  const confusionMessage = `${pokemon.koName}은 혼란에 빠져 있다!`;

  // 33.3% 확률로 자해
  if (uniform() < 0.333) {
    // 위력 40의 물리 공격으로 자신 공격
    const damage = Math.max(
      1,
      Math.floor(
        ((2 * 50) / 5 + 2) * 40 * (pokemon.stats.atk / pokemon.stats.def) / 50 + 2
      )
    );
    pokemon.currentHp = Math.max(0, pokemon.currentHp - damage);
    
    return {
      confused: true,
      selfHit: true,
      damage,
      message: confusionMessage,
      followupMessage: '영문도 모른 채 자신을 공격했다!',
    };
  }
  
  return {
    confused: true,
    selfHit: false,
    message: confusionMessage,
  };
};

// 교체 시 상태 이상 처리
export const handleSwitchStatus = (pokemon: BattlePokemon): void => {
  // 혼란은 교체 시 해제
  if (pokemon.volatileStatus?.type === 'confusion') {
    pokemon.volatileStatus = undefined;
  }
  
  // 잠듦은 턴 수 리셋
  if (pokemon.status?.type === 'sleep') {
    pokemon.status.turnsRemaining = uniformInt(3) + 1;
  }
  
  // 지속성 상태 이상(독, 화상, 마비, 얼음)은 유지
};

// 화상으로 인한 물리 공격 약화
export const getAttackMultiplierFromBurn = (pokemon: BattlePokemon): number => {
  if (pokemon.status?.type === 'burn') {
    return 0.5;
  }
  return 1.0;
};

// 마비로 인한 스피드 감소
export const getSpeedMultiplierFromParalysis = (pokemon: BattlePokemon): number => {
  if (pokemon.status?.type === 'paralysis') {
    return 0.5;
  }
  return 1.0;
};


