import React from 'react';
import { Link } from 'react-router-dom';

import { useGameStore } from '../../state/store';

const DashboardPage: React.FC = () => {
  const trainerName = useGameStore((state) => state.trainerName);
  const points = useGameStore((state) => state.points);
  const inventoryCount = useGameStore((state) => state.inventory.length);
  const partyCount = useGameStore((state) => state.party.length);
  const lastBattleResult = useGameStore((state) => state.lastBattleResult);

  return (
    <div className="page dashboard-page">
      <header className="page-header">
        <div>
          <h1>환영합니다, {trainerName ?? '트레이너'}!</h1>
          <p>화려한 느겜몬 배틀 월드에 오신 것을 환영해요.</p>
        </div>
        <div className="stat-pill">
          <span className="label">보유 포인트</span>
          <strong>{points.toLocaleString()} pt</strong>
        </div>
      </header>

      <section className="grid two">
        <article className="card">
          <h2>파티</h2>
          <p>현재 파티 포켓몬 {partyCount}마리</p>
          <Link to="/party" className="cta">
            파티 관리하기
          </Link>
        </article>
        <article className="card">
          <h2>보유 포켓몬</h2>
          <p>총 {inventoryCount}마리를 보유 중이에요.</p>
          <Link to="/shop" className="cta">
            가챠로 새 포켓몬 뽑기
          </Link>
        </article>
      </section>

      {lastBattleResult && (
        <section className="card highlight">
          <h2>최근 전투 결과</h2>
          <p>
            최근 배틀 결과는{' '}
            <strong>
              {lastBattleResult === 'win' ? '승리' : lastBattleResult === 'loss' ? '패배' : '항복'}
            </strong>{' '}
            입니다.
          </p>
          <Link to="/battle" className="cta">
            다시 배틀하기
          </Link>
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
