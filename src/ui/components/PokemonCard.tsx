import React from 'react';

import type { OwnedPokemon } from '../../state/store';
import { typeLabels } from '../../utils/locale';
import { toDisplayPokemonName } from '../../utils/pokemon-name';
import { SpeciesSprite } from './SpeciesSprite';

export interface PokemonCardProps {
  pokemon: OwnedPokemon;
  variant?: 'party' | 'inventory';
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, variant = 'inventory' }) => (
  <article className={`pokemon-card ${variant}`}>
    <header>
      <h3>{toDisplayPokemonName(pokemon.koName)}</h3>
      <SpeciesSprite
        enName={pokemon.enName}
        size={78}
        className="pokemon-card__sprite"
        fallback={<span className="code">{pokemon.enName}</span>}
      />
    </header>
    <div className="types">
      {pokemon.types.map((type) => (
        <span key={type} className={`type-badge type-${type}`}>
          {typeLabels[type] ?? type.toUpperCase()}
        </span>
      ))}
    </div>
    <ul className="stats">
      <li>
        HP <strong>{pokemon.stats.hp}</strong>
      </li>
      <li>
        공격 <strong>{pokemon.stats.atk}</strong>
      </li>
      <li>
        방어 <strong>{pokemon.stats.def}</strong>
      </li>
      <li>
        특수공격 <strong>{pokemon.stats.spa}</strong>
      </li>
      <li>
        특수방어 <strong>{pokemon.stats.spd}</strong>
      </li>
      <li>
        스피드 <strong>{pokemon.stats.spe}</strong>
      </li>
    </ul>
    <footer>
      <span className="moves">{pokemon.moves.join(' / ')}</span>
    </footer>
  </article>
);
