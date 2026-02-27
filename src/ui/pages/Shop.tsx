import React, { useState } from 'react';

import { useGameStore } from '../../state/store';
import { toDisplayPokemonName } from '../../utils/pokemon-name';
import { GachaModal } from '../components/GachaModal';
import type { GachaMode } from '../components/GachaModal';

type ShopTab = 'pokemon' | 'skills' | 'items';
type MoveChangeMode = 'random' | 'targeted' | null;

interface MoveChangeResult {
  success: boolean;
  oldMove?: string;
  newMove?: string;
  slotIndex?: number;
}

const MOVE_CHANGE_PRICES = {
  random: 50,
  targeted: 300,
};

const POKEMON_DRAW_PRICES = {
  randomWeighted: 300,
  superPack: 1500,
};

const ITEM_DRAW_PRICE = 100;

const ShopPage: React.FC = () => {
  const points = useGameStore((state) => state.points);
  const inventory = useGameStore((state) => state.inventory);
  const party = useGameStore((state) => state.party);
  const spendPoints = useGameStore((state) => state.spendPoints);
  const changeMove = useGameStore((state) => state.changeMove);
  const randomMoveChange = useGameStore((state) => state.randomMoveChange);
  
  const [activeTab, setActiveTab] = useState<ShopTab>('pokemon');
  const [gachaMode, setGachaMode] = useState<GachaMode | null>(null);
  const [moveChangeMode, setMoveChangeMode] = useState<MoveChangeMode>(null);
  const [selectedPokemonId, setSelectedPokemonId] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [moveChangeResult, setMoveChangeResult] = useState<MoveChangeResult | null>(null);

  const allPokemon = [...inventory, ...party.filter(p => !inventory.some(inv => inv.instanceId === p.instanceId))];

  const handleOpenGacha = (mode: GachaMode) => {
    const price = mode === 'random-weighted' ? POKEMON_DRAW_PRICES.randomWeighted : POKEMON_DRAW_PRICES.superPack;
    if (!spendPoints(price)) {
      alert('포인트가 부족합니다!');
      return;
    }
    setGachaMode(mode);
  };

  const handleStartMoveChange = (mode: 'random' | 'targeted') => {
    setMoveChangeMode(mode);
    setSelectedPokemonId(null);
    setSelectedSlot(null);
  };

  const handleRandomMoveChange = async () => {
    if (!selectedPokemonId || selectedSlot === null) return;
    
    if (!spendPoints(MOVE_CHANGE_PRICES.random)) {
      setMoveChangeResult({ success: false });
      return;
    }
    
    const result = await randomMoveChange(selectedPokemonId, selectedSlot);
    setMoveChangeResult(result);
    
    if (result.success) {
      setMoveChangeMode(null);
      setSelectedPokemonId(null);
      setSelectedSlot(null);
    }
  };

  const handleTargetedMoveChange = (newMove: string) => {
    if (!selectedPokemonId || selectedSlot === null) return;
    
    if (!spendPoints(MOVE_CHANGE_PRICES.targeted)) {
      setMoveChangeResult({ success: false });
      return;
    }
    
    const success = changeMove(selectedPokemonId, selectedSlot, newMove);
    setMoveChangeResult({ success });
    
    if (success) {
      setMoveChangeMode(null);
      setSelectedPokemonId(null);
      setSelectedSlot(null);
    }
  };

  return (
    <div className="page shop-page">
      <header className="page-header">
        <h1>느겜몬 상점</h1>
        <div className="stat-pill">
          <span className="label">내 포인트</span>
          <strong>{points.toLocaleString()} pt</strong>
        </div>
      </header>

      <div className="shop-tabs">
        <button
          type="button"
          className={activeTab === 'pokemon' ? 'active' : ''}
          onClick={() => setActiveTab('pokemon')}
        >
          포켓몬
        </button>
        <button
          type="button"
          className={activeTab === 'skills' ? 'active' : ''}
          onClick={() => setActiveTab('skills')}
        >
          기술
        </button>
        <button
          type="button"
          className={activeTab === 'items' ? 'active' : ''}
          onClick={() => setActiveTab('items')}
        >
          아이템
        </button>
      </div>

      {activeTab === 'pokemon' && (
        <div className="shop-section">
          <h2>포켓몬</h2>
          <div className="draw-options">
            <div className="card draw-card">
              <h3>랜덤 포켓몬</h3>
              <p>모든 포켓몬 중 랜덤으로 1마리를 뽑습니다. (종족값 총합이 높을수록 확률이 낮아집니다)</p>
              <button
                type="button"
                className="primary"
                onClick={() => handleOpenGacha('random-weighted')}
                disabled={points < POKEMON_DRAW_PRICES.randomWeighted}
              >
                {POKEMON_DRAW_PRICES.randomWeighted.toLocaleString()} pt 뽑기
              </button>
            </div>

            <div className="card draw-card">
              <h3>슈퍼 팩</h3>
              <p>모든 포켓몬 중 5마리를 순서대로 뽑습니다. (확률 가중치 없음 / 마지막 1마리는 종족값 총합 500+ 확정)</p>
                <button
                  type="button"
                  className="primary"
                onClick={() => handleOpenGacha('super-pack')}
                disabled={points < POKEMON_DRAW_PRICES.superPack}
                >
                {POKEMON_DRAW_PRICES.superPack.toLocaleString()} pt 5연 뽑기
                </button>
              </div>
          </div>
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="shop-section">
          <h2>기술</h2>
          <div className="move-change-options">
            <div className="card">
              <h3>랜덤 기술 변경</h3>
              <p>선택한 포켓몬의 선택한 기술을 랜덤한 새 기술로 교체합니다.</p>
              <button
                type="button"
                className="primary"
                onClick={() => handleStartMoveChange('random')}
                disabled={allPokemon.length === 0}
              >
                {MOVE_CHANGE_PRICES.random} pt - 랜덤 변경
              </button>
            </div>
            <div className="card">
              <h3>선택 기술 변경</h3>
              <p>원하는 슬롯과 기술을 직접 선택합니다.</p>
              <button
                type="button"
                className="primary"
                onClick={() => handleStartMoveChange('targeted')}
                disabled={allPokemon.length === 0}
              >
                {MOVE_CHANGE_PRICES.targeted} pt - 타겟 변경
              </button>
            </div>
          </div>
          
          {moveChangeMode && (
            <div className="move-change-flow card">
              <h3>{moveChangeMode === 'random' ? '랜덤 기술 변경' : '타겟 기술 변경'}</h3>
              
              {!selectedPokemonId && (
                <div className="pokemon-select">
                  <p>포켓몬을 선택하세요:</p>
                  <div className="pokemon-grid">
                    {allPokemon.map((pokemon) => (
                      <button
                        key={pokemon.instanceId}
                        type="button"
                        className="pokemon-select-btn"
                        onClick={() => setSelectedPokemonId(pokemon.instanceId)}
                      >
                        {toDisplayPokemonName(pokemon.koName)}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => setMoveChangeMode(null)}>
                    취소
                  </button>
                </div>
              )}
              
              {selectedPokemonId && moveChangeMode === 'random' && selectedSlot === null && (
                <div className="slot-select">
                  <p>변경할 기술 슬롯을 선택하세요:</p>
                  <div className="move-slots">
                    {allPokemon.find((p) => p.instanceId === selectedPokemonId)?.moves.map((move, index) => (
                      <button
                        key={index}
                        type="button"
                        className="slot-btn"
                        onClick={() => setSelectedSlot(index)}
                      >
                        슬롯 {index + 1}: {move}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => setSelectedPokemonId(null)}>
                    뒤로
                  </button>
                </div>
              )}

              {selectedPokemonId && moveChangeMode === 'random' && selectedSlot !== null && (
                <div className="confirm-random">
                  <p>
                    {toDisplayPokemonName(allPokemon.find((p) => p.instanceId === selectedPokemonId)?.koName ?? '')}의{' '}
                    <strong>슬롯 {selectedSlot + 1}</strong> 기술을 랜덤으로 변경하시겠습니까?
                  </p>
                  <div className="button-row">
                    <button type="button" className="primary" onClick={() => void handleRandomMoveChange()}>
                      확인
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                      setMoveChangeMode(null);
                      setSelectedPokemonId(null);
                        setSelectedSlot(null);
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
              
              {selectedPokemonId && moveChangeMode === 'targeted' && selectedSlot === null && (
                <div className="slot-select">
                  <p>변경할 기술 슬롯을 선택하세요:</p>
                  <div className="move-slots">
                    {allPokemon.find((p) => p.instanceId === selectedPokemonId)?.moves.map((move, index) => (
                      <button
                        key={index}
                        type="button"
                        className="slot-btn"
                        onClick={() => setSelectedSlot(index)}
                      >
                        슬롯 {index + 1}: {move}
                      </button>
                    ))}
                  </div>
                  <button type="button" onClick={() => setSelectedPokemonId(null)}>
                    뒤로
                  </button>
                </div>
              )}
              
              {selectedPokemonId && moveChangeMode === 'targeted' && selectedSlot !== null && (
                <MoveSelector
                  pokemonId={selectedPokemonId}
                  currentMoves={allPokemon.find((p) => p.instanceId === selectedPokemonId)?.moves ?? []}
                  onSelect={handleTargetedMoveChange}
                  onBack={() => setSelectedSlot(null)}
                />
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'items' && (
        <div className="shop-section">
          <h2>아이템</h2>
          <div className="card">
            <h3>아이템 뽑기</h3>
            <p>추후 구현 예정입니다. (현재는 탭만 구성)</p>
            <button type="button" className="primary" disabled>
              {ITEM_DRAW_PRICE} pt - 아이템 뽑기 (준비 중)
            </button>
          </div>
        </div>
      )}

      {gachaMode && <GachaModal mode={gachaMode} onClose={() => setGachaMode(null)} />}
      
      {moveChangeResult && (
        <div className="modal">
          <div className="modal-content revealed">
            <h3>기술 변경 결과</h3>
            {moveChangeResult.success ? (
              <div className="success-message">
                {moveChangeResult.oldMove && moveChangeResult.newMove ? (
                  <div>
                    <p>기술이 성공적으로 변경되었습니다!</p>
                    <div className="move-change-details">
                      <div className="old-move">
                        <span className="label">이전 기술:</span>
                        <span className="move-name">{moveChangeResult.oldMove}</span>
                      </div>
                      <div className="arrow">→</div>
                      <div className="new-move">
                        <span className="label">새 기술:</span>
                        <span className="move-name">{moveChangeResult.newMove}</span>
                      </div>
                    </div>
                    {moveChangeResult.slotIndex !== undefined && (
                      <p className="slot-info">슬롯 {moveChangeResult.slotIndex + 1}번이 변경되었습니다.</p>
                    )}
                  </div>
                ) : (
                  <p>기술이 성공적으로 변경되었습니다!</p>
                )}
              </div>
            ) : (
              <div className="error-message">
                <p>포인트가 부족하거나 변경 가능한 기술이 없습니다.</p>
              </div>
            )}
            <button 
              type="button" 
              className="primary"
              onClick={() => setMoveChangeResult(null)}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface MoveSelectorProps {
  pokemonId: string;
  currentMoves: string[];
  onSelect: (move: string) => void;
  onBack: () => void;
}

const MoveSelector: React.FC<MoveSelectorProps> = ({ pokemonId, currentMoves, onSelect, onBack }) => {
  const [eligibleMoves, setEligibleMoves] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const inventory = useGameStore((state) => state.inventory);
  const party = useGameStore((state) => state.party);

  React.useEffect(() => {
    const loadMoves = async () => {
      const allPokemon = [...inventory, ...party];
      const pokemon = allPokemon.find((p) => p.instanceId === pokemonId);
      if (!pokemon) return;

      const { loadSpeciesCatalog } = await import('../../utils/catalog');
      const catalog = await loadSpeciesCatalog();
      const species = catalog.find((s) => s.enName === pokemon.enName);
      if (!species) return;

      setEligibleMoves(species.learnset);
    };
    void loadMoves();
  }, [pokemonId, inventory, party]);

  const filteredMoves = eligibleMoves.filter(
    (move) => !currentMoves.includes(move) && move.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="move-selector">
      <p>새로운 기술을 선택하세요:</p>
      <input
        type="text"
        placeholder="기술 검색..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="move-list">
        {filteredMoves.length === 0 && <p>사용 가능한 기술이 없습니다.</p>}
        {filteredMoves.map((move) => (
          <button key={move} type="button" className="move-option-btn" onClick={() => onSelect(move)}>
            {move}
          </button>
        ))}
      </div>
      <button type="button" onClick={onBack}>
        뒤로
      </button>
    </div>
  );
};

export default ShopPage;
