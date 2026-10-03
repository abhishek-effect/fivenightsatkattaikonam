import React from 'react';
import { RotateCcw, Home, Skull } from 'lucide-react';

export default function GameOverScreen({ night, jumpscareWho, onRetry, onMainMenu }) {
  const getVictimMessage = (who) => {
    if (who === 'ab') return 'Abhishek caught you unguarded at the doorway.';
    if (who === 'dipu') return 'Dipu sprinted past your hallway defense.';
    if (who === 'aadesh') return 'Aadesh slipped through the blind spot unnoticed.';
    return 'The animatronics overwhelmed the security office.';
  };

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center p-3 sm:p-6 select-none static-fuzz">
      <div className="text-center space-y-4 sm:space-y-6 max-w-md w-full max-h-[90dvh] overflow-y-auto bg-neutral-950/90 border-2 border-red-700 p-5 sm:p-8 rounded-xl backdrop-blur shadow-[0_0_60px_rgba(185,28,28,0.5)]">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-red-950 border-2 border-red-600 flex items-center justify-center text-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)]">
          <Skull size={28} className="sm:w-8 sm:h-8" />
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-widest text-red-600 glitch-text drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
            GAME OVER
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-mono mt-2 sm:mt-3 uppercase tracking-wider">
            {getVictimMessage(jumpscareWho)}
          </p>
          <div className="text-[10px] sm:text-xs text-neutral-500 font-mono mt-1">
            TERMINATED ON NIGHT {night}
          </div>
        </div>

        <div className="pt-2 sm:pt-4 space-y-2.5 sm:space-y-3">
          <button
            onClick={onRetry}
            className="w-full py-3 sm:py-3.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded tracking-widest uppercase text-xs sm:text-sm transition shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <RotateCcw size={16} />
            <span>TRY AGAIN (NIGHT {night})</span>
          </button>

          <button
            onClick={onMainMenu}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 font-bold rounded tracking-wider uppercase text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Home size={15} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>

      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
