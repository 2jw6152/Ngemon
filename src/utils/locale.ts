import type { ElementType } from '../battle/types';

export const typeLabels: Record<ElementType, string> = {
  normal: '노말',
  fire: '불꽃',
  water: '물',
  electric: '전기',
  grass: '풀',
  ice: '얼음',
  fighting: '격투',
  poison: '독',
  ground: '땅',
  flying: '비행',
  psychic: '에스퍼',
  bug: '벌레',
  rock: '바위',
  ghost: '고스트',
  dragon: '드래곤',
  dark: '악',
  steel: '강철',
  fairy: '페어리',
};

export const uiText = {
  surrender: '항복',
  switch: '교체',
  battleStart: '배틀 시작!',
  victory: '승리!',
  defeat: '패배...',
};
