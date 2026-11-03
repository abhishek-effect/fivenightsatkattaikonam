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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
