import React from 'react';

import type { BattleSession, BattleSide, MajorStatus } from '../../battle/types';
import { typeLabels } from '../../utils/locale';
import { toDisplayPokemonName } from '../../utils/pokemon-name';

// 상태 이상 표시 레이블
const statusLabels: Record<MajorStatus, string> = {
  poison: '독',
  burn: '화상',
  paralysis: '마비',
  sleep: '잠듦',
  freeze: '얼음',
};

export interface BattleHudProps {
  session: BattleSession;
  hpOverride?: Partial<Record<BattleSide, number>>;
  maxHpOverride?: Partial<Record<BattleSide, number>>;
  statusOverride?: Partial<Record<BattleSide, MajorStatus | null>>;
}

const formatHp = (current: number, total: number) => `${current} / ${total}`;

const sides: BattleSide[] = ['player', 'opponent'];

export const BattleHUD: React.FC<BattleHudProps> = ({ session, hpOverride, maxHpOverride, statusOverride }) => {
  return (
    <section className="battle-hud card">
      {sides.map((side) => {
        const pokemon = session.snapshot.active[side];
        const hasStatusOverride = statusOverride && Object.prototype.hasOwnProperty.call(statusOverride, side);
        const displayedStatus = hasStatusOverride ? statusOverride?.[side] ?? null : pokemon.status?.type ?? null;
        // maxHp는 반드시 maxHpOverride 사용 (undefined면 기본값 1로)
        const maxHp = maxHpOverride?.[side] ?? 1;
        // hpOverride가 있으면 그것을 사용, 없으면 maxHp 사용 (엔진 HP는 절대 직접 참조 안 함)
        const currentHp = hpOverride?.[side] ?? maxHp;
        const hpRatio = Math.max(0, Math.min(1, currentHp / maxHp));
        return (
          <article key={side} className={`hud-row ${side}`}>
            <header>
              <div className="name-status-row">
                <h3>{toDisplayPokemonName(pokemon.koName)}</h3>
                {displayedStatus && (
                  <span className={`status-badge status-${displayedStatus}`}>
                    {statusLabels[displayedStatus]}
                  </span>
                )}
              </div>
              <div className="types">
                {pokemon.types.map((type) => (
                  <span key={type} className={`type-badge type-${type}`}>
                    {typeLabels[type] ?? type.toUpperCase()}
                  </span>
                ))}
              </div>
            </header>
            <div className="hp-bar">
              <div className="hp-track">
                <div className="hp-fill" style={{ width: `${hpRatio * 100}%` }} />
              </div>
              <span>{formatHp(currentHp, maxHp)}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
};
