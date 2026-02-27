import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { ErrorBoundary } from './ui/components/ErrorBoundary';
import './styles/global.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root not found');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary title="느겜몬이 잠깐 멈췄어요">
      <App />
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>,
);
