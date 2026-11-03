import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

// Global Developer Variable (set to false initially)
// When turned true via browser console (isDeveloper = true), unlocks all nights and custom night
let _isDeveloper = false;
Object.defineProperty(window, 'isDeveloper', {
  get() {
    return _isDeveloper;
  },
  set(val) {
    const nextVal = Boolean(val);
    _isDeveloper = nextVal;
    if (nextVal) {
      console.log('%cHello Pinky/Dip-u. Hope you are not someone else', 'color: #22c55e; font-size: 16px; font-weight: bold;');
      window.dispatchEvent(new CustomEvent('dev-mode-change', {
        detail: { isDeveloper: true, message: 'Hello Pinky/Dip-u. Hope you are not someone else' }
      }));
    } else {
      window.dispatchEvent(new CustomEvent('dev-mode-change', {
        detail: { isDeveloper: false }
      }));
    }
  },
  configurable: true,
  enumerable: true,
});
window.isDeveloper = false;

// Register Service Worker for PWA (Add to Home Screen)
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('PWA service worker registration error:', err);
    });
  });
}

// Global PWA Install Prompt Handler
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPWAInstallPrompt = e;
  window.dispatchEvent(new CustomEvent('pwa-installable'));
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
