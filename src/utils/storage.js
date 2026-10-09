/**
 * Scoped LocalStorage manager for Five Nights at Kattaikonam (FNAK).
 * 
 * NOTE FOR GITHUB PAGES:
 * GitHub Pages hosts all projects for a user under the same origin (e.g. username.github.io/repo/).
 * In Web browsers, localStorage is strictly origin-scoped, meaning every project hosted on
 * *.github.io shares the exact same window.localStorage!
 * All keys here are explicitly prefixed with 'fnak:' so they will never clash with or
 * be corrupted by other applications deployed on the same GitHub Pages user domain.
 */

const STORAGE_PREFIX = 'fnak:';

export const STORAGE_KEYS = {
  UNLOCKED_NIGHT: `${STORAGE_PREFIX}unlocked_night`,
  SELECTED_NIGHT: `${STORAGE_PREFIX}selected_night`,
  LEGACY_NIGHT: 'fnak_night'
};

/**
 * Safely retrieve an item from localStorage.
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
    const item = window.localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (err) {
    console.warn(`[FNAK Storage] Failed to read "${key}" from localStorage:`, err);
    return defaultValue;
  }
}

/**
 * Safely write an item to localStorage.
 */
export function setStorageItem(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.setItem(key, value.toString());
    return true;
  } catch (err) {
    console.warn(`[FNAK Storage] Failed to write "${key}" to localStorage:`, err);
    return false;
  }
}

/**
 * Safely remove an item from localStorage.
 */
export function removeStorageItem(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.warn(`[FNAK Storage] Failed to remove "${key}" from localStorage:`, err);
    return false;
  }
}

/**
 * Retrieve the highest unlocked night (1 to 6).
 * Night 1: Unlocked by default.
 * Night 2: Unlocked only after completing Night 1.
 * Night 3: Unlocked only after completing Night 2.
 * Night 4: Unlocked only after completing Night 3.
 * Night 5: Unlocked only after completing Night 4.
 * Night 6 (Custom Night): Unlocked only after completing Night 5.
 */
export function getUnlockedNight() {
  try {
    // 1. Check scoped key first
    let raw = getStorageItem(STORAGE_KEYS.UNLOCKED_NIGHT);

    // 2. Check legacy key if scoped key not found (migration)
    if (raw === null) {
      const legacy = getStorageItem(STORAGE_KEYS.LEGACY_NIGHT);
      if (legacy !== null) {
        raw = legacy;
        setStorageItem(STORAGE_KEYS.UNLOCKED_NIGHT, legacy);
      }
    }

    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 6) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[FNAK Storage] Error in getUnlockedNight:', err);
  }
  return 1;
}

/**
 * Store the highest unlocked night (clamped between 1 and 6).
 */
export function setUnlockedNight(night) {
  const parsed = parseInt(night, 10);
  const clamped = Math.max(1, Math.min(6, isNaN(parsed) ? 1 : parsed));
  setStorageItem(STORAGE_KEYS.UNLOCKED_NIGHT, clamped);
  // Keep legacy key updated for backwards compatibility
  setStorageItem(STORAGE_KEYS.LEGACY_NIGHT, clamped);
  return clamped;
}

/**
 * Record completion of a night.
 * Unlocks the subsequent night if not already unlocked.
 * E.g., surviving Night 1 unlocks Night 2. Surviving Night 5 unlocks Custom Night (Night 6).
 */
export function unlockNextNight(completedNight) {
  const currentUnlocked = getUnlockedNight();
  const nextTarget = Math.max(currentUnlocked, completedNight + 1);
  const newUnlocked = Math.max(1, Math.min(6, nextTarget));
  setUnlockedNight(newUnlocked);
  return newUnlocked;
}

/**
 * Retrieve the currently selected night.
 * Clamped between 1 and the highest unlocked standard night (up to Night 5).
 */
export function getSelectedNight() {
  const unlocked = getUnlockedNight();
  const maxPlayableStandard = Math.min(5, unlocked);

  try {
    const raw = getStorageItem(STORAGE_KEYS.SELECTED_NIGHT);
    if (raw !== null) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= maxPlayableStandard) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[FNAK Storage] Error in getSelectedNight:', err);
  }

  return maxPlayableStandard;
}

/**
 * Store the currently selected night.
 */
export function setSelectedNight(night) {
  const parsed = parseInt(night, 10);
  const clamped = Math.max(1, Math.min(5, isNaN(parsed) ? 1 : parsed));
  setStorageItem(STORAGE_KEYS.SELECTED_NIGHT, clamped);
  return clamped;
}

/**
 * Reset game progression back to Night 1.
 */
export function resetGameProgress() {
  setUnlockedNight(1);
  setSelectedNight(1);
}
