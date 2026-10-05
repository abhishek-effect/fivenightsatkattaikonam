import React, { useEffect, useState } from 'react';
import { Play, Home, RotateCcw, Pause, ShieldAlert, Zap, Maximize, Minimize } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import { requestAppFullscreen, isAppFullscreen, toggleAppFullscreen } from '../utils/fullscreen';

export default function PauseMenu({ gameState, onResume, onMainMenu, onRestart }) {
  const [isFullscreen, setIsFullscreen] = useState(isAppFullscreen());

  // ESC or P key to resume
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(isAppFullscreen());
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        requestAppFullscreen();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume]);

  const timeDisplay = gameState?.time === 0 ? '12' : gameState?.time;
  const powerPct = Math.round(gameState?.power ?? 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
      {/* Pause Dialogue Box */}
      <div className="relative bg-neutral-950/95 border-2 border-red-600/80 rounded-xl p-4 sm:p-6 md:p-8 max-w-md w-full max-h-[90dvh] overflow-y-auto shadow-[0_0_50px_rgba(220,38,38,0.4)] text-center space-y-4 sm:space-y-6">
        {/* Header with flashing pause badge */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-0.5 sm:py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-ping" />
            <span>FACILITY PROTOCOL PAUSED</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-mono tracking-widest text-white uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            SHIFT SUSPENDED
          </h2>
          <div className="flex justify-center items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono text-gray-400 border-t border-b border-neutral-800 py-1.5 sm:py-2">
            <span className="text-red-400 font-bold">NIGHT {gameState?.night ?? 1}</span>
            <span>•</span>
            <span className="text-white font-bold">{timeDisplay} AM</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Zap size={13} />
              {powerPct}% POWER
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 sm:space-y-3">
          {/* RESUME BUTTON */}
          <button
            onClick={() => {
              requestAppFullscreen();
              onResume();
            }}
            className="w-full py-3 sm:py-3.5 px-4 sm:px-6 bg-emerald-950 hover:bg-emerald-900 border-2 border-emerald-500 hover:border-emerald-400 text-emerald-200 font-mono font-bold tracking-widest text-xs sm:text-sm rounded-lg transition-all duration-150 flex items-center justify-center gap-2 sm:gap-3 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <Play size={16} className="text-emerald-400" />
            <span>RESUME SHIFT <span className="hidden sm:inline">[ESC]</span></span>
          </button>

          {/* TOGGLE FULLSCREEN BUTTON */}
          <button
            onClick={toggleAppFullscreen}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-yellow-400 text-gray-200 font-mono text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {isFullscreen ? <Minimize size={15} className="text-yellow-400" /> : <Maximize size={15} className="text-yellow-400" />}
            <span>{isFullscreen ? 'EXIT FULLSCREEN' : 'TOGGLE FULLSCREEN'}</span>
          </button>

          {/* RESTART NIGHT BUTTON */}
          {onRestart && (
            <button
              onClick={onRestart}
              className="w-full py-2 sm:py-2.5 px-4 sm:px-6 bg-neutral-900 hover:bg-neutral-800 border border-yellow-600/60 hover:border-yellow-500 text-yellow-400 font-mono font-semibold tracking-wider text-xs rounded-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <RotateCcw size={14} />
              <span>RESTART NIGHT</span>
            </button>
          )}

          {/* RETURN TO MAIN MENU BUTTON */}
          <button
            onClick={onMainMenu}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-red-950/80 hover:bg-red-900 border-2 border-red-600 hover:border-red-400 text-red-200 font-mono font-bold tracking-wider text-xs rounded-lg transition shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={15} />
            <span>ABANDON SHIFT • MAIN MENU</span>
          </button>
        </div>

        {/* Footer tip */}
        <div className="text-[11px] font-mono text-gray-500">
          Surveillance feeds & security power consumption are currently frozen.
        </div>
      </div>

      {/* CRT Scanline overlay on pause screen */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
