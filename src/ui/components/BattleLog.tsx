import React from 'react';

import type { BattleLogEntry } from '../../battle/types';

export interface BattleLogProps {
  currentLog: BattleLogEntry | null;
}

const sideLabel = {
  player: 'Player',
  opponent: 'Opponent',
  system: 'System',
} as const;

export const BattleLog: React.FC<BattleLogProps> = ({ currentLog }) => {
  return (
    <section className="battle-log card">
      <h2>Battle Log</h2>
      <div className="battle-log-feed">
        {!currentLog && <p className="empty">No logs yet.</p>}
        {currentLog && (
          <article key={currentLog.id} className="log-card">
            <header>{sideLabel[currentLog.side]}</header>
            <p>{currentLog.message}</p>
          </article>
        )}
      </div>
    </section>
  );
};
