import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Settings, HelpCircle, Users, Maximize, Minimize } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import { NIGHT_PRESETS } from '../game/gameEngine';
import { requestAppFullscreen, isAppFullscreen, toggleAppFullscreen } from '../utils/fullscreen';

export default function MainMenu({ onStartGame, currentNight, onSelectNight }) {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [showCredits, setShowCredits] = useState(false);
  const [showCustomNight, setShowCustomNight] = useState(false);
  const [showHowToPlayScare, setShowHowToPlayScare] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isAppFullscreen());
  const [customAI, setCustomAI] = useState({ ab: 10, dipu: 10, aadesh: 10 });
  const [isGlitchCalm, setIsGlitchCalm] = useState(false);
  const [glitchBurst, setGlitchBurst] = useState(false);
  const scareTimeoutRef = useRef(null);

  // Sync fullscreen state
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

  // Play Main Menu BGM on mount and cleanup on unmount
  useEffect(() => {
    soundManager.playMenuBgm();
    return () => {
      soundManager.stopMenuBgm();
      if (scareTimeoutRef.current) clearTimeout(scareTimeoutRef.current);
    };
  }, []);

  // Moving grain & glitch cycle: active for ~4.5s, then disappears for 1.0s to feel alive!
  useEffect(() => {
    let calmTimer = null;
    let burstTimer = null;

    const cycleInterval = setInterval(() => {
      // 1-second calm disappearance
      setIsGlitchCalm(true);

      calmTimer = setTimeout(() => {
        setIsGlitchCalm(false);
        // Sudden violent burst when snapping back
        setGlitchBurst(true);
        burstTimer = setTimeout(() => setGlitchBurst(false), 250);
      }, 1000);
    }, 5500);

    return () => {
      clearInterval(cycleInterval);
      if (calmTimer) clearTimeout(calmTimer);
      if (burstTimer) clearTimeout(burstTimer);
    };
  }, []);

  const handleToggleFullscreen = (e) => {
    e.stopPropagation();
    toggleAppFullscreen();
  };

  const handleToggleMute = (e) => {
    e.stopPropagation();
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playMenuBgm();
    }
  };

  const handleCustomStart = () => {
    requestAppFullscreen();
    soundManager.stopMenuBgm();
    onStartGame(6, {
      abLevel: customAI.ab,
      dipuLevel: customAI.dipu,
      aadeshLevel: customAI.aadesh,
      doorWaitTime: 1.0,
      hourSeconds: 400 / 6,
      label: 'Night 6 - Custom Night'
    });
  };

  const handleStartShift = (night) => {
    requestAppFullscreen();
    soundManager.stopMenuBgm();
    onStartGame(night);
  };

  // Troll Jumpscare trigger when clicking "HOW TO PLAY"
  const triggerHowToPlayScare = () => {
    soundManager.stopMenuBgm();
    soundManager.playJumpscare();
    setShowHowToPlayScare(true);

    if (scareTimeoutRef.current) clearTimeout(scareTimeoutRef.current);
    scareTimeoutRef.current = setTimeout(() => {
      setShowHowToPlayScare(false);
      soundManager.playMenuBgm();
    }, 2200);
  };

  const dismissHowToPlayScare = () => {
    if (scareTimeoutRef.current) clearTimeout(scareTimeoutRef.current);
    setShowHowToPlayScare(false);
    soundManager.playMenuBgm();
  };

  // Ensure music plays if browser blocked initial autoplay until click
  const handleInteraction = () => {
    if (!showHowToPlayScare) {
      soundManager.playMenuBgm();
    }
  };

  return (
    <div 
      onClick={handleInteraction}
      className="relative w-screen min-h-[100dvh] h-[100dvh] overflow-hidden bg-black flex flex-col justify-between p-3 sm:p-6 md:p-8 select-none"
    >
      {/* Background menu image with shaky glitch motion */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-200 ${
          isGlitchCalm ? 'scale-100 filter contrast-105' : 'menu-bg-shaky filter contrast-115'
        } ${glitchBurst ? 'translate-x-2.5 -translate-y-1.5 filter contrast-160 brightness-130' : ''}`}
        style={{ backgroundImage: `url('./assets/images/main-menu.jpg')` }}
      />

      {/* Moving Film Grain Overlay - Disappears for 1 second periodically */}
      <div 
        className={`grain-layer transition-opacity duration-300 ${
          isGlitchCalm ? 'opacity-0' : 'opacity-25'
        }`} 
      />

      {/* CRT Scanline & static overlay */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <div 
        className={`absolute inset-0 static-fuzz pointer-events-none transition-opacity duration-200 ${
          isGlitchCalm ? 'opacity-5' : 'opacity-25'
        }`} 
      />

      {/* Horizontal Glitch Tear Lines (Hidden during 1s calm period) */}
      {!isGlitchCalm && (
        <>
          <div className="absolute top-[28%] inset-x-0 h-2 bg-white/25 mix-blend-screen glitch-slice-bar pointer-events-none" />
          <div className="absolute top-[65%] inset-x-0 h-3 bg-red-600/30 mix-blend-color-dodge glitch-slice-bar pointer-events-none" style={{ animationDelay: '0.7s' }} />
          <div className="absolute top-[44%] inset-x-0 h-1.5 bg-cyan-400/35 mix-blend-screen glitch-slice-bar pointer-events-none" style={{ animationDelay: '1.3s' }} />
        </>
      )}

      {/* Header controls */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-black/60 backdrop-blur border border-red-500/40 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded">
          <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-600 animate-ping mr-1 sm:mr-2" />
          <span className="text-red-500 font-bold tracking-widest text-[10px] sm:text-xs md:text-sm uppercase font-mono">
            CCTV v0.26.10
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 sm:p-2.5 rounded bg-black/70 hover:bg-yellow-950/80 border border-yellow-600/60 hover:border-yellow-400 transition text-gray-300 hover:text-white flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize size={16} className="text-yellow-400" /> : <Maximize size={16} className="text-yellow-400" />}
            <span className="text-[10px] sm:text-xs font-mono font-bold text-yellow-300">{isFullscreen ? 'WINDOWED' : 'FULLSCREEN'}</span>
          </button>

          <button
            onClick={handleToggleMute}
            className="p-1.5 sm:p-2.5 rounded bg-black/70 hover:bg-red-950/80 border border-gray-700 hover:border-red-500 transition text-gray-300 hover:text-white flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-sm cursor-pointer active:scale-95"
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-green-400" />}
            <span>{isMuted ? 'MUTED' : 'BGM ON'}</span>
          </button>
        </div>
      </div>

      {/* TOP MIDDLE TITLE: Five Nights at Kattaikonam */}
      <div className="relative z-10 mx-auto text-center space-y-1 sm:space-y-1.5 pt-1 sm:pt-2 pointer-events-none max-w-2xl">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-widest text-red-600 glitch-text drop-shadow-[0_4px_25px_rgba(255,0,0,0.9)]">
          FIVE NIGHTS
        </h1>
        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-[0.25em] sm:tracking-[0.3em] text-gray-100 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
          AT KATTAIKONAM
        </h2>
        <div className="flex items-center justify-center gap-2 sm:gap-3 pt-0.5 sm:pt-1">
          <span className="w-6 sm:w-16 h-[1px] bg-red-600/60" />
          <p className="text-[9px] sm:text-xs text-red-400 font-mono tracking-[0.2em] sm:tracking-[0.25em] uppercase">
            SURVIVE 12:00 AM TO 6:00 AM
          </p>
          <span className="w-6 sm:w-16 h-[1px] bg-red-600/60" />
        </div>
      </div>

      {/* LEFT MIDDLE NAVIGATION: New Game, How to Play, Credits, etc. */}
      <div className="relative z-10 w-full max-w-sm mx-auto sm:mx-0 my-auto space-y-2.5 sm:space-y-4 bg-black/80 p-3.5 sm:p-5 md:p-6 rounded-xl border border-neutral-800 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.9)] max-h-[58dvh] sm:max-h-none overflow-y-auto">
        <div className="text-[11px] sm:text-xs font-mono font-bold text-gray-400 tracking-widest border-b border-neutral-800 pb-1.5 flex justify-between items-center">
          <span>MAIN MENU</span>
          <span className="text-red-500 font-mono">v0.26.10</span>
        </div>

        {/* Menu Actions */}
        <div className="space-y-2 sm:space-y-2.5">
          {/* PLAY / CONTINUE BUTTON */}
          <button
            onClick={() => handleStartShift(currentNight)}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-5 bg-red-900/40 hover:bg-red-700/60 border-2 border-red-600 hover:border-red-400 text-white font-bold tracking-widest text-xs sm:text-sm md:text-base rounded transition-all duration-150 flex items-center justify-center gap-2 sm:gap-3 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] group cursor-pointer active:scale-98"
          >
            <Play size={16} className="text-red-400 group-hover:scale-125 transition-transform" />
            <span>{currentNight === 1 ? 'PLAY (NIGHT 1)' : `CONTINUE (NIGHT ${currentNight})`}</span>
          </button>

          {/* NEW GAME BUTTON */}
          <button
            onClick={() => handleStartShift(1)}
            className="w-full py-2 sm:py-2.5 px-4 sm:px-5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-gray-300 text-gray-200 font-semibold tracking-wider text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>NEW GAME (NIGHT 1)</span>
          </button>

          {/* NIGHT SELECTOR GRID */}
          <div className="pt-0.5 sm:pt-1">
            <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-mono">SELECT NIGHT:</div>
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => {
                    onSelectNight(n);
                    handleStartShift(n);
                  }}
                  className={`py-1 sm:py-1.5 text-xs font-bold rounded border transition cursor-pointer font-mono active:scale-95 ${
                    n === currentNight
                      ? 'bg-red-600/35 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                      : 'bg-black/60 border-neutral-800 hover:border-neutral-500 text-gray-400 hover:text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* CUSTOM NIGHT BUTTON */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowCustomNight(true); }}
            className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-neutral-950 hover:bg-neutral-900 border border-yellow-600/50 hover:border-yellow-400 text-yellow-400 font-mono text-[11px] sm:text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Settings size={13} />
            <span>CUSTOM NIGHT (AI CONFIG)</span>
          </button>

          {/* HOW TO PLAY BUTTON */}
          <button
            onClick={(e) => { e.stopPropagation(); triggerHowToPlayScare(); }}
            className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-neutral-950 hover:bg-neutral-900 border border-neutral-700 hover:border-red-500 text-gray-300 hover:text-red-400 font-mono text-[11px] sm:text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
          >
            <HelpCircle size={13} className="text-gray-400 group-hover:text-red-400 group-hover:scale-110 transition" />
            <span>HOW TO PLAY</span>
          </button>

          {/* CREDITS BUTTON */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowCredits(true); }}
            className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-neutral-950 hover:bg-neutral-900 border border-neutral-700 hover:border-cyan-400 text-cyan-400 font-mono text-[11px] sm:text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Users size={13} />
            <span>CREDITS</span>
          </button>
        </div>
      </div>

      {/* Footer controls & credits */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs text-gray-400 bg-black/60 backdrop-blur border-t border-neutral-900 pt-2 pb-1 sm:pt-3">
        <div className="flex gap-2 sm:gap-4 items-center flex-wrap justify-center font-mono">
          <span className="sm:hidden text-amber-400">TOUCH: DRAG TO PAN • TAP DOOR / LIGHT / CAMS</span>
          <span className="hidden sm:inline">CONTROLS: [SPACE] Monitor</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">[D] Door Lock</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">[L] Hallway Light</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">[ESC] Pause</span>
        </div>
        <div className="text-gray-400 mt-1 sm:mt-0 font-mono text-[9px] sm:text-xs text-center">
          IIT Chanthavila Computer Entertainment • v0.26.10
        </div>
      </div>

      {/* HOW TO PLAY JUMPSCARE POPUP (Shows How-to-play.jpg with screams and then disappears) */}
      {showHowToPlayScare && (
        <div 
          onClick={(e) => { e.stopPropagation(); dismissHowToPlayScare(); }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none"
        >
          {/* Intense red flash & vignette */}
          <div className="absolute inset-0 bg-red-600/35 mix-blend-color-dodge pointer-events-none animate-pulse" />

          {/* Jumpscare Image: How-to-play.jpg */}
          <div className="relative w-full h-full flex items-center justify-center shake-intense">
            <img 
              src="./assets/images/how-to-play.jpg" 
              alt="How to Play" 
              loading="eager"
              decoding="sync"
              className="max-h-[95vh] max-w-[95vw] object-contain filter contrast-125 brightness-115 drop-shadow-[0_0_60px_rgba(255,0,0,0.95)] jumpscare-anim"
            />
          </div>

          {/* Retro CRT scanlines and noise */}
          <div className="crt-overlay" />
          <div className="crt-vignette" />
          <div className="absolute inset-0 static-fuzz opacity-40 pointer-events-none" />
        </div>
      )}

      {/* CREDITS MODAL */}
      {showCredits && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-neutral-950 border-2 border-cyan-500/80 rounded-xl max-w-md w-full max-h-[85dvh] overflow-y-auto p-4 sm:p-6 text-gray-200 space-y-4 sm:space-y-5 shadow-[0_0_50px_rgba(6,182,212,0.35)]">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h3 className="text-base sm:text-lg font-bold text-cyan-400 flex items-center gap-2 font-mono">
                <Users size={18} />
                PRODUCTION CREDITS
              </h3>
              <button 
                onClick={() => setShowCredits(false)}
                className="text-gray-400 hover:text-white font-mono text-base cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs font-mono space-y-3 sm:space-y-4 leading-relaxed">
              <div className="p-2.5 sm:p-3 bg-neutral-900/80 border border-neutral-800 rounded text-center">
                <p className="text-gray-300 font-semibold italic">
                  Inspired by Five Nights at Freddy's by Scott Cawthon
                </p>
              </div>

              <div className="space-y-2.5 sm:space-y-3">
                <div className="border-l-2 border-red-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Lead Developer</span>
                  <span className="text-red-400 font-bold text-sm">Pinky</span>
                </div>

                <div className="border-l-2 border-orange-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Creative Head</span>
                  <span className="text-orange-400 font-bold text-sm">Dip-u</span>
                </div>

                <div className="border-l-2 border-yellow-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Photos</span>
                  <div className="text-yellow-300 font-semibold space-y-0.5 mt-0.5">
                    <p>Devkrishna</p>
                    <p>Aadesh</p>
                    <p>Abhishek</p>
                  </div>
                </div>

                <div className="border-l-2 border-cyan-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Audio</span>
                  <span className="text-cyan-300 font-semibold">Audio from Pixabay</span>
                </div>

                <div className="border-l-2 border-purple-500 pl-3">
                  <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Development</span>
                  <span className="text-purple-300 font-bold">Coded by Gemini</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCredits(false)}
              className="w-full py-2.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-200 font-mono font-bold text-xs rounded tracking-wider uppercase cursor-pointer"
            >
              CLOSE CREDITS
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM NIGHT AI LEVEL MODAL */}
      {showCustomNight && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
        >
          <div className="bg-neutral-900 border-2 border-yellow-600 rounded-lg max-w-md w-full max-h-[85dvh] overflow-y-auto p-4 sm:p-6 text-gray-200 space-y-4 sm:space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-700 pb-2">
              <h3 className="text-base sm:text-lg font-bold text-yellow-400 flex items-center gap-2">
                <Settings size={18} />
                CUSTOM NIGHT AI SETTINGS (0 - 20)
              </h3>
              <button 
                onClick={() => setShowCustomNight(false)}
                className="text-gray-400 hover:text-white font-mono cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'AB', key: 'ab', color: 'text-red-400' },
                { name: 'DIPU', key: 'dipu', color: 'text-cyan-400' },
                { name: 'AADESH', key: 'aadesh', color: 'text-yellow-400' }
              ].map(char => (
                <div key={char.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span className={char.color}>{char.name} DIFFICULTY</span>
                    <span className="font-mono text-base">{customAI[char.key]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={customAI[char.key]}
                    onChange={(e) => setCustomAI({ ...customAI, [char.key]: parseInt(e.target.value) })}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCustomAI({ ab: 20, dipu: 20, aadesh: 20 })}
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-red-400 font-bold border border-red-500/50 rounded cursor-pointer"
              >
                20/20/20 MODE
              </button>
              <button
                onClick={handleCustomStart}
                className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs rounded cursor-pointer"
              >
                START CUSTOM NIGHT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
