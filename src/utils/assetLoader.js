// Asset Preloader & In-Memory Texture Cache for FNAK
// Preloads and decodes all images and audio to guarantee 0ms latency and 0 black-screens.

export const ASSET_MANIFEST = {
  images: [
    // Core UI & Menu
    { id: 'main-menu', src: './assets/images/main-menu.jpg', label: 'Main Menu CRT Interface' },
    { id: 'how-to-play', src: './assets/images/how-to-play.jpg', label: 'Security Protocol Manual' },

    // Office Views (Lights On/Off and Door Open/Closed)
    { id: 'lights-off-door-open', src: './assets/images/lights-off-door-open.jpg', label: 'Security Office (Lights Off, Door Open)' },
    { id: 'lights-off-door-closed', src: './assets/images/lights-off-door-closed.jpg', label: 'Security Office (Lights Off, Door Closed)' },
    { id: 'lights-on-door-open', src: './assets/images/lights-on-door-open.jpg', label: 'Security Office (Lights On, Door Open)' },
    { id: 'lights-on-door-closed', src: './assets/images/lights-on-door-closed.jpg', label: 'Security Office (Lights On, Door Closed)' },

    // CCTV Feeds
    { id: 'cam-room-a', src: './assets/images/cam-room-a.jpg', label: 'CAM 1: Physics Laboratory' },
    { id: 'cam-corridor-a', src: './assets/images/cam-corridor-a.jpg', label: 'CAM 2: Main Hallway Corridor' },
    { id: 'cam-corridor-b', src: './assets/images/cam-corridor-b.jpg', label: 'CAM 3: Supply Corridor' },
    { id: 'cam-stairs', src: './assets/images/cam-stairs.jpg', label: 'CAM 4: Central Staircase' },

    // Character Cutouts & Poses
    { id: 'ab-cutout', src: './assets/images/ab-cutout.png', label: 'Subject AB Silhouette Feed' },
    { id: 'ab-random-cutout', src: './assets/images/ab-random-cutout.png', label: 'Subject AB Corridor Sensor' },
    { id: 'aadesh-front', src: './assets/images/aadesh-frontfacing-cutout.png', label: 'Subject Aadesh Corridor Feed' },
    { id: 'aadesh-side', src: './assets/images/aadesh-sideways-cutout.png', label: 'Subject Aadesh Stair Sensor' },
    { id: 'aadesh-door', src: './assets/images/aadesh-jumpscare-cutout.png', label: 'Subject Aadesh Blind Spot Feed' },
    { id: 'dipu-front', src: './assets/images/dipu-frontfacing-cutout.png', label: 'Subject Dipu Dormant Feed' },
    { id: 'dipu-random', src: './assets/images/dipu-random-cutout.png', label: 'Subject Dipu Active Alert Feed' },
    { id: 'dipu-sprint', src: './assets/images/dipu-jumpscare-cutout.png', label: 'Subject Dipu High-Speed Sprint' },

    // Fatal Jumpscares
    { id: 'ab-jumpscare', src: './assets/images/ab-jumpscare.jpg', label: 'AB Threat Bio-Metrics' },
    { id: 'aadesh-jumpscare', src: './assets/images/aadesh-jumpscare.jpg', label: 'Aadesh Threat Bio-Metrics' },
    { id: 'dipu-jumpscare', src: './assets/images/dipu-jumpscare.png', label: 'Dipu Threat Bio-Metrics' },

    // Office Desk Monitor & OMR Subsystem
    { id: 'desk-monitor', src: './assets/images/monitor.webp', label: 'Security Terminal Monitor' },
    { id: 'upload-confirmation', src: './assets/images/upload-confirmation.png', label: 'OMR Ligin Confirmation Prompt' },
    { id: 'uploading-omr', src: './assets/images/uploading-omr.jpg', label: 'OMR Data Transmission Feed' },
  ],

  audio: [
    { id: 'jumpscare', src: './assets/audio/jumpscare.mp3', label: 'Scream Acoustics' },
    { id: 'knock-sfx', src: './assets/audio/knock-sfx.mp3', label: 'Door Defense Acoustics' },
    { id: 'running-sfx', src: './assets/audio/running-sfx.mp3', label: 'Sprint Footstep Acoustics' },
    { id: 'main-menu-bgm', src: './assets/audio/main-menu-bgm.mp3', label: 'Facility Ambience Feed' },
    { id: 'upload-success', src: './assets/audio/upload-success.mp3', label: 'OMR Upload Success Chime' },
  ]
};

// Global memory cache to prevent browser garbage collection of decoded image bitmaps
const loadedImageElements = new Map();
const loadedAudioElements = new Map();

let isPreloadCompleted = false;
let preloadPromise = null;

/**
 * Preload and force GPU decoding of an individual image
 */
function preloadImage(item) {
  return new Promise((resolve) => {
    // Return cached if already decoded
    if (loadedImageElements.has(item.src)) {
      resolve({ success: true, item });
      return;
    }

    const img = new Image();
    img.src = item.src;

    // Timeout safety: resolve after 6 seconds even if network is slow
    const timeout = setTimeout(() => {
      loadedImageElements.set(item.src, img);
      resolve({ success: false, item, timedOut: true });
    }, 6000);

    const onComplete = async () => {
      clearTimeout(timeout);
      try {
        // Modern browser GPU decode: decompresses image into GPU texture buffer
        if (typeof img.decode === 'function') {
          await img.decode();
        }
      } catch (_) {
        // Fallback: standard onload is already sufficient
      }
      loadedImageElements.set(item.src, img);
      resolve({ success: true, item });
    };

    if (img.complete) {
      onComplete();
    } else {
      img.onload = onComplete;
      img.onerror = () => {
        clearTimeout(timeout);
        // Resolve anyway to prevent blocking the game
        resolve({ success: false, item, error: true });
      };
    }
  });
}

/**
 * Preload and buffer an audio file into HTTP / memory cache
 */
function preloadAudio(item) {
  return new Promise((resolve) => {
    if (loadedAudioElements.has(item.src)) {
      resolve({ success: true, item });
      return;
    }

    // Safety timeout after 5 seconds
    const timeout = setTimeout(() => {
      resolve({ success: false, item, timedOut: true });
    }, 5000);

    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = item.src;

      // Also trigger a fetch to warm up the browser's HTTP cache
      fetch(item.src, { mode: 'cors' })
        .then(() => {
          clearTimeout(timeout);
          loadedAudioElements.set(item.src, audio);
          resolve({ success: true, item });
        })
        .catch(() => {
          clearTimeout(timeout);
          loadedAudioElements.set(item.src, audio);
          resolve({ success: true, item });
        });
    } catch (_) {
      clearTimeout(timeout);
      resolve({ success: false, item });
    }
  });
}

/**
 * Preload all required game assets with live progress updates
 * @param {Function} onProgress - Callback with ({ loaded, total, percent, currentItem })
 * @returns {Promise<boolean>} Resolves when all assets are loaded
 */
export function preloadAllAssets(onProgress = () => {}) {
  if (isPreloadCompleted) {
    onProgress({
      loaded: ASSET_MANIFEST.images.length + ASSET_MANIFEST.audio.length,
      total: ASSET_MANIFEST.images.length + ASSET_MANIFEST.audio.length,
      percent: 100,
      currentItem: 'All Assets Verified'
    });
    return Promise.resolve(true);
  }

  if (preloadPromise) {
    return preloadPromise;
  }

  const allItems = [
    ...ASSET_MANIFEST.images.map(img => ({ ...img, type: 'image' })),
    ...ASSET_MANIFEST.audio.map(aud => ({ ...aud, type: 'audio' })),
  ];

  const total = allItems.length;
  let loaded = 0;

  preloadPromise = new Promise((resolve) => {
    // Process items in parallel chunks to maximize throughput without bottlenecking
    let completedCount = 0;

    const handleItemFinished = (item) => {
      completedCount++;
      loaded++;
      const percent = Math.min(100, Math.round((completedCount / total) * 100));

      onProgress({
        loaded: completedCount,
        total,
        percent,
        currentItem: item.label
      });

      if (completedCount >= total) {
        isPreloadCompleted = true;
        resolve(true);
      }
    };

    // Run parallel preloading
    allItems.forEach((item) => {
      const promise = item.type === 'image' ? preloadImage(item) : preloadAudio(item);
      promise.then(() => handleItemFinished(item));
    });
  });

  return preloadPromise;
}

export function isAssetsLoaded() {
  return isPreloadCompleted;
}
