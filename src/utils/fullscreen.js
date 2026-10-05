// Cross-browser Fullscreen API utility for FNAK
// Provides YouTube-style fullscreen support across Desktop and Mobile

export function requestAppFullscreen() {
  try {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      const p = el.requestFullscreen();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  } catch (err) {
    console.warn('Fullscreen request blocked or not supported:', err);
  }
}

export function exitAppFullscreen() {
  try {
    if (document.exitFullscreen) {
      const p = document.exitFullscreen();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } catch (err) {
    console.warn('Exit fullscreen failed:', err);
  }
}

export function isAppFullscreen() {
  return Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

export function toggleAppFullscreen() {
  if (isAppFullscreen()) {
    exitAppFullscreen();
  } else {
    requestAppFullscreen();
  }
}
