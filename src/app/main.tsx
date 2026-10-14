import '../shared/styles/tokens.css';
import '../shared/styles/global.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from '../shared/ui/ErrorBoundary';
import { reportError } from '../platform/monitoring/logger';
window.addEventListener('error', (event) =>
  reportError(event.error ?? event.message, { scope: 'global', code: 'UNHANDLED_ERROR' }),
);
window.addEventListener('unhandledrejection', (event) =>
  reportError(event.reason, { scope: 'global', code: 'UNHANDLED_REJECTION' }),
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary onError={(error) => reportError(error, { scope: 'app', code: 'RENDER_FAILED' })}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
