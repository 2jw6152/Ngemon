import React, { useEffect, useRef, useState } from 'react';

import type { ElementType } from '../../battle/types';
import { useGameStore } from '../../state/store';
import { drawShopRandomPokemonWeighted, drawSuperPack } from '../../utils/gacha';
import { toDisplayPokemonName } from '../../utils/pokemon-name';
import { SpeciesSprite } from './SpeciesSprite';
import { SparkleFX } from './effects/SparkleFX';

export interface GachaModalProps {
  mode: GachaMode;
  onClose: () => void;
}

export type GachaMode = 'random-weighted' | 'super-pack';

type DrawResult = Awaited<ReturnType<typeof drawShopRandomPokemonWeighted>>;
type PackResult = Awaited<ReturnType<typeof drawSuperPack>>;

export const GachaModal: React.FC<GachaModalProps> = ({ mode, onClose }) => {
  const addToInventory = useGameStore((state) => state.addToInventory);
  const [isRevealed, setRevealed] = useState(false);
  const [results, setResults] = useState<(DrawResult | PackResult[number])[]>([]);
  const [packIndex, setPackIndex] = useState(0);
  const [packPhase, setPackPhase] = useState<'idle' | 'enter' | 'exit' | 'final'>('idle');
  const [showFinalBurst, setShowFinalBurst] = useState(false);
  const timersRef = useRef<number[]>([]);
  const addedIndexRef = useRef<Set<number>>(new Set());
  const sequenceRef = useRef(0);
  const packIndexRef = useRef(0);

  useEffect(() => {
    packIndexRef.current = packIndex;
  }, [packIndex]);

  useEffect(() => {
    let active = true;
    sequenceRef.current += 1;
    const sequence = sequenceRef.current;
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    addedIndexRef.current = new Set();
    packIndexRef.current = 0;
    setShowFinalBurst(false);
    setRevealed(false);
    setResults([]);
    setPackIndex(0);
    setPackPhase('idle');

    const timer = setTimeout(() => {
      const promise =
        mode === 'random-weighted'
          ? drawShopRandomPokemonWeighted().then((pokemon) => [pokemon])
          : drawSuperPack();

      promise
        .then((pokemonList) => {
          if (!active) return;
          setResults(pokemonList);
          setRevealed(true);

          if (pokemonList.length <= 1) {
            packIndexRef.current = 0;
            setPackIndex(0);
            setPackPhase('final');
            return;
          }

          // 슈퍼 팩: 1장씩 "등장 -> 잠깐 유지 -> 사라짐 -> 다음" 방식 (마지막은 남기고 이펙트)
          const SHOW_MS = 900;
          const EXIT_MS = 280;
          const BETWEEN_MS = 140;

          const safeSetPhase = (expectedIndex: number, phase: 'enter' | 'exit' | 'final') => {
            if (!active || sequenceRef.current !== sequence) {
              return;
            }
            if (packIndexRef.current !== expectedIndex) {
              return;
            }
            setPackPhase(phase);
          };

          const scheduleStep = (index: number) => {
            if (!active || sequenceRef.current !== sequence) {
              return;
            }
            // IMPORTANT: update ref synchronously to avoid race with previous timeouts
            packIndexRef.current = index;
            setPackIndex(index);
            setPackPhase('enter');

            const isLast = index >= pokemonList.length - 1;
            if (isLast) {
              const finalId = window.setTimeout(() => {
                safeSetPhase(index, 'final');
                setShowFinalBurst(true);
                const burstId = window.setTimeout(() => setShowFinalBurst(false), 1600);
                timersRef.current.push(burstId);
              }, SHOW_MS);
              timersRef.current.push(finalId);
              return;
            }

            const exitId = window.setTimeout(() => safeSetPhase(index, 'exit'), SHOW_MS);
            timersRef.current.push(exitId);

            const nextId = window.setTimeout(() => scheduleStep(index + 1), SHOW_MS + EXIT_MS + BETWEEN_MS);
            timersRef.current.push(nextId);
          };

          scheduleStep(0);
        })
        .catch((error) => {
          console.error('가챠에 실패했습니다', error);
          if (active) {
            setRevealed(true);
          }
        });
    }, 1200);

    return () => {
      active = false;
      clearTimeout(timer);
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [mode, addToInventory]);

  useEffect(() => {
    if (!isRevealed || results.length === 0) {
      return;
    }

    const shouldAdd =
      results.length === 1 ? packPhase === 'final' : packPhase === 'enter' || packPhase === 'final';

    if (!shouldAdd) {
      return;
    }

    if (addedIndexRef.current.has(packIndex)) {
      return;
    }

    const pokemon = results[packIndex];
    if (!pokemon) {
      return;
    }

    addToInventory({
      instanceId: crypto.randomUUID(),
      speciesId: pokemon.speciesId,
      koName: pokemon.koName,
      enName: pokemon.enName,
      stats: pokemon.stats,
      types: pokemon.types as ElementType[],
      moves: pokemon.moves,
    });
    addedIndexRef.current.add(packIndex);
  }, [isRevealed, results, packIndex, packPhase, addToInventory]);

  const current = results[packIndex];
  const isPack = results.length > 1;
  const isFinalCard = isPack && packIndex === results.length - 1 && (packPhase === 'enter' || packPhase === 'final');
  // 안전장치: 마지막 카드가 화면에 떴으면(final 전 enter 상태라도) 닫기 가능하게 한다.
  // (타이밍 이슈로 final 전환이 누락되어도 유저가 갇히지 않도록)
  const isAtLastCard = isPack && packIndex === results.length - 1 && packPhase !== 'idle';
  const canClose = !isPack || packPhase === 'final' || isAtLastCard;

  const phaseClass = packPhase === 'enter' ? 'gacha-reveal-card--enter' : packPhase === 'exit' ? 'gacha-reveal-card--exit' : '';
  const subtitle = mode === 'super-pack' && isPack ? `슈퍼 팩 ${Math.min(packIndex + 1, results.length)} / ${results.length}` : undefined;

  return (
    <div className="modal gacha-modal">
      <div className={`modal-content ${isRevealed ? 'revealed' : ''}`}>
        {!isRevealed && <p className="loading">네온 플래시가 켜지는 중...</p>}
        {isRevealed && results.length > 0 && (
          <>
            <h2>축하합니다!</h2>
            {subtitle && <p className="subtitle">{subtitle}</p>}

            {current ? (
              <div className="gacha-reveal-stage">
                <div
                  key={`${current.speciesId}-${packIndex}`}
                  className={[
                    'card',
                    'gacha-reveal-card',
                    phaseClass,
                    isFinalCard ? 'gacha-reveal-card--final' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
            <SpeciesSprite
                    enName={current.enName}
              size={220}
              className="gacha-modal__sprite"
                    fallback={<span className="sprite-fallback">{toDisplayPokemonName(current.enName)}</span>}
            />
            <p className="pokemon-name">
                    {toDisplayPokemonName(current.koName)} ({toDisplayPokemonName(current.enName)})
            </p>
                  {isFinalCard && <p className="small">확정 (종족값 총합 500+)</p>}

                  {isFinalCard && showFinalBurst && (
                    <div className="gacha-reveal-card__fx" aria-hidden="true">
                      <SparkleFX duration={1500} />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="gacha-reveal-stage">
                <div className="card gacha-reveal-card">
                  <p className="subtitle">결과를 불러오는 중...</p>
                  <p className="small">만약 화면이 멈췄다면 아래 버튼으로 닫을 수 있어요.</p>
                </div>
              </div>
            )}

            <button type="button" className="primary" onClick={onClose} disabled={!canClose}>
              {canClose ? '닫기' : '공개 중...'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
