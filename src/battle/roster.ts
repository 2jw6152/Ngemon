import type { BattlePokemon } from './types';

export interface OwnedPokemon extends Omit<BattlePokemon, 'currentHp' | 'moves'> {
  moves: string[];
  isStarter?: boolean;
}
