import React, { useMemo, useState } from 'react';

import type { OwnedPokemon } from '../../state/store';
import { useGameStore } from '../../state/store';
import { PokemonCard } from '../components/PokemonCard';

const PartyPage: React.FC = () => {
  const party = useGameStore((state) => state.party);
  const inventory = useGameStore((state) => state.inventory);
  const setParty = useGameStore((state) => state.setParty);
  
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const benchOptions = useMemo(
    () => inventory.filter((poke) => !party.some((member) => member.instanceId === poke.instanceId)),
    [inventory, party],
  );

  const removeFromParty = (instanceId: string) => {
    setParty(party.filter((pokemon) => pokemon.instanceId !== instanceId));
  };

  const addToParty = (pokemon: OwnedPokemon) => {
    if (party.length >= 6) {
      alert('파티는 최대 6마리까지 편성할 수 있습니다.');
      return;
    }
    setParty([...party, pokemon]);
  };
  
  // 드래그 앤 드랍 핸들러
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };
  
  const handleDragLeave = () => {
    setDragOverIndex(null);
  };
  
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    const newParty = [...party];
    const [draggedPokemon] = newParty.splice(draggedIndex, 1);
    newParty.splice(dropIndex, 0, draggedPokemon);
    
    setParty(newParty);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };
  
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="page party-page">
      <h1>파티 편성</h1>
      <section>
        <h2>현재 파티 ({party.length} / 6)</h2>
        <p className="party-help-text">
          드래그하여 순서를 변경할 수 있습니다
        </p>
        <div className="card-grid">
          {party.length === 0 && <p>파티가 비어 있습니다.</p>}
          {party.map((pokemon, index) => (
            <div
              key={pokemon.instanceId}
              className={`card-with-action draggable-card ${draggedIndex === index ? 'dragging' : ''} ${dragOverIndex === index ? 'drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <PokemonCard pokemon={pokemon} variant="party" />
              <button type="button" onClick={() => removeFromParty(pokemon.instanceId)}>
                제외하기
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>보유 포켓몬</h2>
        <div className="card-grid">
          {benchOptions.length === 0 && <p>추가 포켓몬이 없습니다.</p>}
          {benchOptions.map((pokemon) => (
            <div key={pokemon.instanceId} className="card-with-action">
              <PokemonCard pokemon={pokemon} variant="inventory" />
              <button type="button" onClick={() => addToParty(pokemon)}>
                파티에 추가
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PartyPage;
