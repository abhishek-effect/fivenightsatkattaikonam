import React, { useEffect } from 'react';
import { soundManager } from '../audio/SoundManager';

export default function NightIntro({ night, onFinish }) {
  useEffect(() => {
    soundManager.playStaticBurst(0.2, 0.2);

    const timer = setTimeout(() => {
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const getNightOrdinal = (n) => {
    if (n === 1) return '1st Night';
    if (n === 2) return '2nd Night';
    if (n === 3) return '3rd Night';
    if (n === 4) return '4th Night';
    if (n === 5) return '5th Night';
    return `Night ${n}`;
  };

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center p-4 select-none">
      <div className="text-center space-y-3 sm:space-y-4 animate-pulse">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold font-mono tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
          12:00 AM
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-mono tracking-widest text-red-500 uppercase">
          {getNightOrdinal(night)}
        </h2>
      </div>

      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
