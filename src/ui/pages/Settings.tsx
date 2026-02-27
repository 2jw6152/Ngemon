import React from 'react';

import { useGameStore } from '../../state/store';

const SettingsPage: React.FC = () => {
  const trainerName = useGameStore((state) => state.trainerName);
  const logout = useGameStore((state) => state.logout);
  const reset = useGameStore((state) => state.reset);

  return (
    <div className="page settings-page">
      <h1>설정</h1>
      <section className="card">
        <h2>트레이너 정보</h2>
        <p>현재 로그인: {trainerName ?? '알 수 없음'}</p>
        <div className="button-row">
          <button type="button" onClick={logout}>
            로그아웃
          </button>
          <button type="button" className="danger" onClick={reset}>
            전체 초기화
          </button>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
