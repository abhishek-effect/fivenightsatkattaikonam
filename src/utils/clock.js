/**
 * Clock formatting helper for Five Nights at Kattaikonam (FNAK)
 * @param {number} time - In-game hour (0 = 12 AM, 1 = 1 AM, ... 6 = 6 AM)
 * @param {number} timeProgress - Float from 0.0 to 1.0 within the current hour
 * @param {boolean} showMinutes - Whether to show detailed minutes (e.g. 1:44 AM vs 1 AM)
 * @returns {string} Formatted clock string (e.g. "12 AM", "12:00 AM", "1:44 AM")
 */
export function formatGameClock(time, timeProgress = 0, showMinutes = false) {
  const displayHour = time === 0 ? 12 : time;
  if (!showMinutes) {
    return `${displayHour} AM`;
  }
  const totalMinutes = Math.min(59, Math.max(0, Math.floor((timeProgress || 0) * 60)));
  const paddedMinutes = String(totalMinutes).padStart(2, '0');
  return `${displayHour}:${paddedMinutes} AM`;
}
