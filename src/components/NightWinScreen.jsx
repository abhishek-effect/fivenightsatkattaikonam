import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { soundManager } from '../audio/SoundManager';
import { Trophy, ChevronRight, Home } from 'lucide-react';

export default function NightWinScreen({ night, onNextNight, onMainMenu }) {
  const [displayedTime, setDisplayedTime] = useState('5:59 AM');

  useEffect(() => {
    // Play 6 AM chimes
    soundManager.play6AMChimes();

    // Roll clock to 6:00 AM after 1.2 seconds
    const rollTimer = setTimeout(() => {
      setDisplayedTime('6:00 AM');
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    }, 1200);

    return () => clearTimeout(rollTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center p-6 select-none">
      <div className="text-center space-y-6 max-w-md w-full bg-neutral-950/80 border-2 border-green-600/70 p-8 rounded-xl backdrop-blur shadow-[0_0_50px_rgba(22,163,74,0.3)]">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-950/80 border-2 border-green-500 flex items-center justify-center text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]">
          <Trophy size={32} />
        </div>

        <div>
          <div className="text-6xl md:text-7xl font-extrabold font-mono tracking-widest text-green-400 drop-shadow-[0_0_25px_rgba(34,197,94,0.8)]">
            {displayedTime}
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-mono tracking-widest text-white uppercase mt-2">
            NIGHT {night} CLEARED!
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
            Shift survived. Campus safe until dusk.
          </p>
        </div>

        <div className="pt-4 space-y-3">
          {night < 5 && (
            <button
              onClick={onNextNight}
              className="w-full py-3.5 bg-green-700 hover:bg-green-600 text-white font-bold rounded tracking-widest uppercase text-sm transition shadow-[0_0_20px_rgba(22,163,74,0.6)] flex items-center justify-center gap-2"
            >
              <span>PROCEED TO NIGHT {night + 1}</span>
              <ChevronRight size={18} />
            </button>
          )}

          <button
            onClick={onMainMenu}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 font-bold rounded tracking-wider uppercase text-xs transition flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>RETURN TO MAIN MENU</span>
          </button>
        </div>
      </div>

      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
