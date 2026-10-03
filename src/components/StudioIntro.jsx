import React, { useEffect, useState } from 'react';
import { soundManager } from '../audio/SoundManager';
import { Film, Sparkles } from 'lucide-react';

export default function StudioIntro({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeStage, setFadeStage] = useState('in'); // 'in', 'show', 'out'

  useEffect(() => {
    // Attempt audio jingle playback
    soundManager.playStudioJingle();

    const duration = 5000; // 5 seconds
    const intervalTime = 50;
    const increment = (intervalTime / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 85) {
          setFadeStage('out');
        }
        if (next >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const endTimer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  const handleSkip = () => {
    onFinish();
  };

  return (
    <div 
      onClick={handleSkip}
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none cursor-pointer transition-opacity duration-700 ${
        fadeStage === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-black to-black pointer-events-none" />

      {/* CRT Scanline & Grain */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <div className="absolute inset-0 static-fuzz opacity-20 pointer-events-none" />

      {/* Center Studio Logo & Text */}
      <div className="relative z-10 text-center space-y-4 px-6 max-w-xl animate-fade-in">
        {/* Emblem / Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-600/20 border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse">
          <Film size={32} className="text-amber-400" />
        </div>

        {/* Studio Title */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 drop-shadow-[0_2px_15px_rgba(245,158,11,0.6)] font-mono">
            IIT CHANTHAVILA
          </h1>
          <h2 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-[0.2em] sm:tracking-[0.25em] text-amber-500/90 uppercase font-mono">
            COMPUTER ENTERTAINMENT
          </h2>
        </div>

        {/* Tagline / Subtitle */}
        <div className="pt-2 flex items-center justify-center gap-2 text-[10px] sm:text-sm font-mono tracking-[0.3em] sm:tracking-[0.4em] text-neutral-400 uppercase">
          <span className="w-6 h-[1px] bg-neutral-600" />
          <span>PRESENTS</span>
          <span className="w-6 h-[1px] bg-neutral-600" />
        </div>
      </div>

      {/* 5-second Linear Progress Indicator */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-6 sm:inset-x-12 max-w-md mx-auto z-10 space-y-2">
        <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
          <span>INITIALIZING</span>
          <button 
            onClick={(e) => { e.stopPropagation(); handleSkip(); }}
            className="text-neutral-400 hover:text-amber-400 transition cursor-pointer"
          >
            TAP TO SKIP ▶
          </button>
        </div>
      </div>
    </div>
  );
}
