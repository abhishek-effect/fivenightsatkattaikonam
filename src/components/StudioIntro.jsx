import React, { useEffect, useState, useRef } from 'react';
import { soundManager } from '../audio/SoundManager';
import { Film, CheckCircle2, Loader2 } from 'lucide-react';
import { preloadAllAssets } from '../utils/assetLoader';
import { requestAppFullscreen } from '../utils/fullscreen';

export default function StudioIntro({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [assetStatus, setAssetStatus] = useState('Initializing facility feeds...');
  const [isLoaded, setIsLoaded] = useState(false);
  const [fadeStage, setFadeStage] = useState('in'); // 'in', 'show', 'out'
  const skipRequestedRef = useRef(false);
  const minTimeElapsedRef = useRef(false);
  const isFinishedRef = useRef(false);

  const finishIntro = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setFadeStage('out');
    setTimeout(() => {
      onFinish();
    }, 450);
  };

  useEffect(() => {
    // Attempt audio jingle playback
    soundManager.playStudioJingle();

    // Minimum display timer: ensure cinematic studio title is seen for at least 3 seconds
    const minTimer = setTimeout(() => {
      minTimeElapsedRef.current = true;
      if (skipRequestedRef.current || isLoaded) {
        finishIntro();
      }
    }, 3200);

    // Active Preloading: Download and GPU-decode all images & audio to memory
    preloadAllAssets(({ percent, currentItem }) => {
      setProgress(percent);
      if (currentItem) {
        setAssetStatus(`Buffering: ${currentItem}`);
      }
    }).then(() => {
      setIsLoaded(true);
      setAssetStatus('All security feeds & audio buffers online');
      setProgress(100);

      // If user requested skip earlier or min display time already passed, finish now
      if (skipRequestedRef.current || minTimeElapsedRef.current) {
        setTimeout(finishIntro, 350);
      }
    }).catch((err) => {
      console.warn('Preload warning:', err);
      setIsLoaded(true);
      setProgress(100);
      if (minTimeElapsedRef.current) finishIntro();
    });

    // Fallback safety timer: after 6.5s, advance regardless
    const maxTimer = setTimeout(() => {
      finishIntro();
    }, 6500);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [onFinish]);

  const handleSkip = () => {
    requestAppFullscreen();
    skipRequestedRef.current = true;
    if (isLoaded) {
      finishIntro();
    } else {
      setAssetStatus(`Loading critical assets (${progress}%)... Please wait`);
    }
  };

  return (
    <div 
      onClick={handleSkip}
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-6 select-none cursor-pointer transition-opacity duration-500 ${
        fadeStage === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-black to-black pointer-events-none" />

      {/* CRT Scanline & Grain */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <div className="absolute inset-0 static-fuzz opacity-20 pointer-events-none" />

      {/* Top placeholder for flex spacing */}
      <div className="w-full h-8" />

      {/* Center Studio Logo & Text */}
      <div className="relative z-10 text-center space-y-4 px-6 max-w-xl animate-fade-in my-auto">
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

      {/* Real Preload Progress Indicator & Status Bar */}
      <div className="relative z-10 w-full max-w-md mx-auto space-y-2.5 pb-4">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <div 
            className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status Line */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2 text-neutral-400 truncate max-w-[240px] sm:max-w-xs">
            {isLoaded ? (
              <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
            ) : (
              <Loader2 size={13} className="text-amber-400 animate-spin shrink-0" />
            )}
            <span className="text-amber-300 font-bold">{progress}%</span>
            <span className="text-neutral-600">•</span>
            <span className="truncate text-neutral-400">{assetStatus}</span>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); handleSkip(); }}
            className={`font-mono transition cursor-pointer font-bold px-2 py-0.5 rounded border text-[10px] active:scale-95 ${
              isLoaded 
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 hover:bg-amber-500/30' 
                : 'bg-black/50 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
          >
            {isLoaded ? 'ENTER ▶' : 'SKIP ▶'}
          </button>
        </div>
      </div>
    </div>
  );
}
