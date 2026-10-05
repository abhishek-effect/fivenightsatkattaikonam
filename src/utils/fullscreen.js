// Cross-browser Fullscreen API utility for FNAK
// Provides YouTube-style fullscreen support across Desktop, Tablets, and Mobile Phones

export function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export function isFullscreenSupported() {
  if (typeof document === 'undefined') return false;
  const el = document.documentElement;
  return Boolean(
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullscreen
  );
}

export function isAppFullscreen() {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.webkitCurrentFullScreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

export function requestAppFullscreen() {
  try {
    const el = document.documentElement || document.body || document.getElementById('root');
    if (!el) return;

    // navigationUI: 'hide' tells mobile OS (Android / Chrome) to hide system back/home bars
    const options = { navigationUI: 'hide' };

    if (el.requestFullscreen) {
      const p = el.requestFullscreen(options);
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Retry without navigationUI if the browser doesn't accept the options parameter
          el.requestFullscreen().catch(() => {});
        });
      }
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.webkitRequestFullScreen) {
      el.webkitRequestFullScreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  } catch (err) {
    console.warn('Fullscreen request blocked or not supported on this device:', err);
  }

  // Mobile address bar collapse trigger
  try {
    window.scrollTo(0, 1);
  } catch (_) {}
}

export function exitAppFullscreen() {
  try {
    if (document.exitFullscreen) {
      const p = document.exitFullscreen();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } catch (err) {
    console.warn('Exit fullscreen failed:', err);
  }
}

export function toggleAppFullscreen() {
  if (isAppFullscreen()) {
    exitAppFullscreen();
  } else {
    requestAppFullscreen();
  }
}
