import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGameStore } from '../../state/store';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const login = useGameStore((state) => state.login);
  const ensureStarterParty = useGameStore((state) => state.ensureStarterParty);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!nickname.trim()) {
      return;
    }
    login(nickname.trim());
    await ensureStarterParty();
    navigate('/dashboard');
  };

  return (
    <div className="page login-page">
      <div className="login-card">
        <h1>느겜몬 트레이너 센터</h1>
        <p className="subtitle">트레이너 이름을 입력하고 모험을 시작하세요.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="nickname">트레이너 이름</label>
          <input
            id="nickname"
            value={nickname}
            placeholder="예) 소라"
            onChange={(event) => setNickname(event.target.value)}
          />
          <button type="submit">시작하기</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
