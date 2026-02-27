import React from 'react';
import { NavLink, Outlet, Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import { useGameStore } from './state/store';
import LoginPage from './ui/pages/Login';
import DashboardPage from './ui/pages/Dashboard';
import BattlePage from './ui/pages/Battle';
import ShopPage from './ui/pages/Shop';
import PartyPage from './ui/pages/Party';
import SettingsPage from './ui/pages/Settings';

const NAV_ITEMS = [
  { path: '/dashboard', label: '대시보드' },
  { path: '/battle', label: '배틀' },
  { path: '/shop', label: '상점' },
  { path: '/party', label: '파티' },
  { path: '/settings', label: '설정' },
];

const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
  const loggedIn = useGameStore((state) => state.loggedIn);
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const Layout: React.FC = () => {
  const trainerName = useGameStore((state) => state.trainerName);
  const startCpuBattle = useGameStore((state) => state.startCpuBattle);
  const partyCount = useGameStore((state) => state.party.length);
  const activeBattle = useGameStore((state) => state.activeBattle);
  const navigate = useNavigate();

  const handleStartBattle = async () => {
    if (partyCount === 0 || activeBattle) {
      return;
    }
    await startCpuBattle();
    navigate('/battle');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="branding">
          <span className="badge">느겜몬</span>
          <strong>전투 대시보드</strong>
        </div>
        <nav>
          {NAV_ITEMS.map((item) => {
            const disabled = Boolean(activeBattle) && item.path !== '/battle';
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => {
                  const base = isActive ? 'nav-link active' : 'nav-link';
                  return disabled ? `${base} disabled` : base;
                }}
                onClick={(event) => {
                  if (disabled) {
                    event.preventDefault();
                  }
                }}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <p>
            트레이너: <strong>{trainerName}</strong>
          </p>
          <button type="button" className="primary" onClick={handleStartBattle} disabled={partyCount === 0 || Boolean(activeBattle)}>
            CPU 배틀 시작
          </button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/*"
      element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }
    >
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="battle" element={<BattlePage />} />
      <Route path="shop" element={<ShopPage />} />
      <Route path="party" element={<PartyPage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route index element={<Navigate to="dashboard" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;
