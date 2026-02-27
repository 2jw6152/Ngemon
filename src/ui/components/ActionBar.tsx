import React from 'react';

import type { BattlePokemon, BattleSession } from '../../battle/types';
import { useGameStore } from '../../state/store';
import { typeLabels } from '../../utils/locale';
import { toDisplayPokemonName } from '../../utils/pokemon-name';
import { SpeciesSprite } from './SpeciesSprite';

type SwitchMode = 'manual' | 'forced' | null;

export interface ActionBarProps {
  session: BattleSession;
  disabled?: boolean;
  switchMode?: SwitchMode;
  switchOptions?: Array<{ pokemon: BattlePokemon; index: number }>;
  onSwitchSelect?: (index: number) => void;
  onCancelSwitch?: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  session,
  disabled = false,
  switchMode = null,
  switchOptions = [],
  onSwitchSelect,
  onCancelSwitch,
}) => {
  const playerActive = session.snapshot.active.player;
  const submitCommand = useGameStore((state) => state.submitBattleCommand);
  const requestPlayerSwitch = useGameStore((state) => state.requestPlayerSwitch);

  const forcedSwitchPending =
    session.pendingChoice === 'player' &&
    session.snapshot.active.player.currentHp <= 0 &&
    session.snapshot.bench.player.some((pokemon) => pokemon.currentHp > 0);

  const lockForActions = disabled || switchMode !== null || forcedSwitchPending;

  const handleMoveClick = (moveId: string) => {
    if (lockForActions) {
      return;
    }
    submitCommand({ kind: 'move', moveId });
  };

  const handleSwitchRequest = () => {
    if (lockForActions) {
      return;
    }
    const hasCandidate = session.snapshot.bench.player.some((pokemon) => pokemon.currentHp > 0);
    if (!hasCandidate) {
      window.alert('교체할 포켓몬이 없습니다.');
      return;
    }
    requestPlayerSwitch();
  };

  const handleSurrender = () => {
    submitCommand({ kind: 'surrender' });
  };

  const renderSwitchChooser = () => {
    if (switchMode === null) {
      return null;
    }
    const title =
      switchMode === 'manual'
        ? '교체할 포켓몬을 선택하세요'
        : '다음 포켓몬을 선택해주세요';

    return (
      <div className="switch-chooser">
        <h2 className="switch-chooser__title">{title}</h2>
        <div className="switch-chooser__options">
          {switchOptions.length === 0 && (
            <p className="switch-chooser__empty">교체 가능한 포켓몬이 없습니다.</p>
          )}
          {switchOptions.map(({ pokemon, index }) => {
            const hpPercent = (pokemon.currentHp / pokemon.stats.hp) * 100;
            return (
              <button
                key={pokemon.instanceId}
                type="button"
                className="switch-chooser__option"
                disabled={disabled}
                onClick={() => {
                  if (disabled) {
                    return;
                  }
                  onSwitchSelect?.(index);
                }}
              >
                <div className="switch-option__sprite">
                  <SpeciesSprite
                    enName={pokemon.enName}
                    size={80}
                    fallback={<span className="sprite-fallback-small">{toDisplayPokemonName(pokemon.koName)}</span>}
                  />
                </div>
                <div className="switch-option__info">
                  <strong className="switch-option__name">{toDisplayPokemonName(pokemon.koName)}</strong>
                  <div className="switch-option__types">
                    {pokemon.types.map((type) => (
                      <span key={type} className="type-badge type-badge--small">
                        {typeLabels[type] ?? type}
                      </span>
                    ))}
                  </div>
                  <div className="switch-option__hp">
                    <span className="hp-text">
                      HP {pokemon.currentHp}/{pokemon.stats.hp}
                    </span>
                    <div className="hp-bar-mini">
                      <div 
                        className="hp-bar-mini__fill"
                        style={{ 
                          width: `${hpPercent}%`,
                          background: hpPercent > 50 ? '#2ecc71' : hpPercent > 20 ? '#f39c12' : '#e74c3c'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {switchMode === 'manual' && onCancelSwitch && (
          <button type="button" className="secondary cancel-switch-btn" onClick={onCancelSwitch} disabled={disabled}>
            취소
          </button>
        )}
      </div>
    );
  };

  if (switchMode !== null) {
    return <section className="action-bar card">{renderSwitchChooser()}</section>;
  }

  return (
    <section className="action-bar card">
      <h2>행동 선택</h2>
      <div className="move-grid">
        {playerActive.moves.map((move) => (
          <button
            key={move.id}
            type="button"
            className="move-btn"
            disabled={lockForActions || move.remainingPp <= 0}
            onClick={() => handleMoveClick(move.id)}
          >
            <strong>{move.name}</strong>
            <span className="meta">
              {typeLabels[move.type] ?? move.type} / PP {move.remainingPp}/{move.pp}
            </span>
          </button>
        ))}
      </div>
      <div className="action-row">
        <button type="button" onClick={handleSwitchRequest} disabled={lockForActions}>
          포켓몬 교체
        </button>
        <button type="button" className="danger" onClick={handleSurrender}>
          항복하기
        </button>
      </div>
    </section>
  );
};
