import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Settings, HelpCircle, Users, Maximize, Minimize, BookOpen, ShieldAlert, Zap, Lock, Lightbulb, Camera, Upload, AlertTriangle } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import { NIGHT_PRESETS } from '../game/gameEngine';
import { requestAppFullscreen, isAppFullscreen, toggleAppFullscreen } from '../utils/fullscreen';

export default function MainMenu({ onStartGame, currentNight, unlockedNight = 1, onSelectNight, onResetProgress }) {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [showCredits, setShowCredits] = useState(false);
  const [showCustomNight, setShowCustomNight] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isAppFullscreen());
  const [customAI, setCustomAI] = useState({ ab: 10, dipu: 10, aadesh: 10 });
  const [isGlitchCalm, setIsGlitchCalm] = useState(false);
  const [glitchBurst, setGlitchBurst] = useState(false);

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
    if (unlockedNight < 6) return;
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
    if (night > unlockedNight && night <= 5) return;
    requestAppFullscreen();
    soundManager.stopMenuBgm();
    onStartGame(night);
  };

  // Open / Close "How to Play" screen
  const openHowToPlay = () => {
    setShowHowToPlay(true);
  };

  const closeHowToPlay = () => {
    setShowHowToPlay(false);
  };

  // Ensure music plays if browser blocked initial autoplay until click
  const handleInteraction = () => {
    soundManager.playMenuBgm();
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
            onClick={() => handleStartShift(Math.min(currentNight, Math.min(5, unlockedNight)))}
            className="w-full py-2.5 sm:py-3 px-4 sm:px-5 bg-red-900/40 hover:bg-red-700/60 border-2 border-red-600 hover:border-red-400 text-white font-bold tracking-widest text-xs sm:text-sm md:text-base rounded transition-all duration-150 flex items-center justify-center gap-2 sm:gap-3 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] group cursor-pointer active:scale-98"
          >
            <Play size={16} className="text-red-400 group-hover:scale-125 transition-transform" />
            <span>{currentNight === 1 && unlockedNight === 1 ? 'PLAY (NIGHT 1)' : `CONTINUE (NIGHT ${currentNight})`}</span>
          </button>

          {/* NEW GAME BUTTON */}
          <button
            onClick={() => {
              onSelectNight(1);
              handleStartShift(1);
            }}
            className="w-full py-2 sm:py-2.5 px-4 sm:px-5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-gray-300 text-gray-200 font-semibold tracking-wider text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>NEW GAME (NIGHT 1)</span>
          </button>

          {/* NIGHT SELECTOR GRID */}
          <div className="pt-0.5 sm:pt-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                SELECT NIGHT:
              </span>
              {unlockedNight > 1 && onResetProgress && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Reset shift progress back to Night 1? All unlocked nights will be re-locked.')) {
                      onResetProgress();
                    }
                  }}
                  className="text-[9px] text-red-500/80 hover:text-red-400 font-mono underline hover:no-underline cursor-pointer transition"
                  title="Reset all progress back to Night 1"
                >
                  RESET DATA
                </button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
              {[1, 2, 3, 4, 5].map(n => {
                const isLocked = n > unlockedNight;
                const isSelected = n === currentNight;

                if (isLocked) {
                  return (
                    <button
                      key={n}
                      disabled
                      title={`Locked: Complete Night ${n - 1} to unlock`}
                      className="py-1 sm:py-1.5 text-xs font-bold rounded border font-mono bg-neutral-950/60 border-neutral-900 text-neutral-600 cursor-not-allowed opacity-50 flex items-center justify-center gap-0.5 select-none"
                    >
                      <Lock size={10} className="text-neutral-600" />
                      <span>{n}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={n}
                    onClick={() => {
                      onSelectNight(n);
                      handleStartShift(n);
                    }}
                    title={`Start Night ${n}`}
                    className={`py-1 sm:py-1.5 text-xs font-bold rounded border transition cursor-pointer font-mono active:scale-95 ${
                      isSelected
                        ? 'bg-red-600/35 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                        : 'bg-black/60 border-neutral-800 hover:border-neutral-500 text-gray-400 hover:text-white'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUSTOM NIGHT BUTTON */}
          {unlockedNight < 6 ? (
            <button
              disabled
              title="Locked: Complete Night 5 to unlock Custom Night"
              className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-neutral-950/60 border border-neutral-800/80 text-neutral-500 font-mono text-[11px] sm:text-xs rounded flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
            >
              <Lock size={13} className="text-neutral-500" />
              <span>CUSTOM NIGHT (BEAT NIGHT 5 TO UNLOCK)</span>
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setShowCustomNight(true); }}
              className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-neutral-950 hover:bg-neutral-900 border border-yellow-600/50 hover:border-yellow-400 text-yellow-400 font-mono text-[11px] sm:text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-[0_0_10px_rgba(234,179,8,0.15)]"
            >
              <Settings size={13} />
              <span>CUSTOM NIGHT (AI CONFIG)</span>
            </button>
          )}

          {/* HOW TO PLAY BUTTON */}
          <button
            onClick={(e) => { e.stopPropagation(); openHowToPlay(); }}
            className="w-full py-1.5 sm:py-2 px-3 sm:px-4 bg-neutral-950 hover:bg-neutral-900 border border-neutral-700 hover:border-emerald-500 text-gray-300 hover:text-emerald-400 font-mono text-[11px] sm:text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer group active:scale-98"
          >
            <HelpCircle size={13} className="text-gray-400 group-hover:text-emerald-400 group-hover:scale-110 transition" />
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

      {/* HOW TO PLAY PROTOCOL MANUAL MODAL */}
      {showHowToPlay && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none animate-fadeIn"
        >
          <div className="bg-neutral-950 border-2 border-emerald-500/80 rounded-xl max-w-4xl w-full max-h-[92dvh] flex flex-col overflow-hidden text-gray-200 shadow-[0_0_50px_rgba(16,185,129,0.3)] font-mono">
            {/* Header */}
            <div className="flex justify-between items-center bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-2 tracking-wider">
                  <BookOpen size={17} />
                  SECURITY PROTOCOL MANUAL // HOW TO PLAY
                </h3>
              </div>
              <button 
                onClick={closeHowToPlay}
                className="text-gray-400 hover:text-white hover:bg-neutral-800 rounded p-1 transition cursor-pointer font-bold text-sm"
                title="Close Manual"
              >
                ✕
              </button>
            </div>

            {/* Content: 2-Column Responsive Body */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-neutral-800">
              {/* LEFT COLUMN: Clear, Detailed Guide */}
              <div className="flex-1 p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto text-xs leading-relaxed">
                
                {/* Section 1: Objective */}
                <div className="space-y-1.5 border-l-2 border-emerald-500 pl-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                    <ShieldAlert size={14} />
                    <span>Shift Objective</span>
                  </div>
                  <p className="text-gray-300">
                    Survive from <strong className="text-white">12:00 AM to 6:00 AM</strong> (400 seconds total shift). Keep the facility power above 0%. If power runs out completely, a total blackout occurs and you will be defenseless against the animatronics!
                  </p>
                </div>

                {/* Section 2: Office Controls */}
                <div className="space-y-2 border-l-2 border-cyan-500 pl-3">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider text-xs">
                    <Zap size={14} />
                    <span>Office Defense Controls</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded space-y-0.5">
                      <div className="flex items-center gap-1.5 text-red-400 font-bold">
                        <Lock size={12} />
                        <span>DOOR LOCK [D]</span>
                      </div>
                      <p className="text-gray-400">
                        Locks the blast door to block animatronics standing outside. Consumes power while closed!
                      </p>
                    </div>

                    <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded space-y-0.5">
                      <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                        <Lightbulb size={12} />
                        <span>HALLWAY LIGHT [L]</span>
                      </div>
                      <p className="text-gray-400">
                        Lights up the dark doorway outside. Reveals threats lurking in the shadow or blind spot!
                      </p>
                    </div>

                    <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Camera size={12} />
                        <span>SURVEILLANCE [SPACE]</span>
                      </div>
                      <p className="text-gray-400">
                        Opens CCTV monitor to track CAM 1 (Physics Lab), CAM 2 & 3 (Corridors), and CAM 4 (Stairs).
                      </p>
                    </div>

                    <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded space-y-0.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                        <Maximize size={12} />
                        <span>PANNING & QUICK GLANCE</span>
                      </div>
                      <p className="text-gray-400">
                        Move mouse (PC) or touch drag / tap DESK & DOOR buttons (mobile) to look around the office.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: The Three Threats */}
                <div className="space-y-2 border-l-2 border-red-500 pl-3">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider text-xs">
                    <AlertTriangle size={14} />
                    <span>The Three Animatronics</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-gray-300">
                    <p className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                      <strong className="text-red-400">AB (Abhishek):</strong> Moves through CAM 1 → CAM 2 → CAM 4 → Office Door. When footsteps approach, check with Light [L]. If he stands in the doorway, shut the door [D] immediately until he bangs on the door and retreats!
                    </p>
                    <p className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                      <strong className="text-yellow-400">Aadesh:</strong> Sneaks through the central staircase into your doorway blind spot. Turn on the Light [L] to check. If his face appears in the doorway light, close the door [D]!
                    </p>
                    <p className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                      <strong className="text-orange-400">Dipu (The Sprinter):</strong> Lurks in CAM 3 (Supply Corridor). Watch CAM 3 regularly to stall him! If left unwatched, he sprints down the hall (hear fast sprinting SFX!). Close the door [D] before he collides with the doorway!
                    </p>
                  </div>
                </div>

                {/* Section 4: Desk Monitor & OMR Uploads */}
                <div className="space-y-1.5 border-l-2 border-purple-500 pl-3">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase tracking-wider text-xs">
                    <Upload size={14} />
                    <span>Desk Monitor // OMR Upload System</span>
                  </div>
                  <p className="text-gray-300">
                    Located on the office desk counter near the water dispenser. Click or tap the monitor to upload OMR sheets to Ligin:
                  </p>
                  <ul className="list-disc list-inside text-[11px] text-gray-400 space-y-0.5">
                    <li><strong className="text-purple-300">Hour Skips:</strong> Night 1 & 2 require 2 uploads per hour skip; Night 3 requires 3 uploads; Night 4 & 5 require 4 uploads.</li>
                    <li><strong className="text-emerald-400">0% Power Drain:</strong> Uploading OMR does NOT consume any power!</li>
                    <li><strong className="text-yellow-400">Cooldown:</strong> 15-second cooldown between uploads.</li>
                    <li><strong className="text-red-400">Upload Lock:</strong> You cannot leave the upload screen without clicking &quot;CANCEL UPLOAD&quot;, which resets progress to 0%.</li>
                  </ul>
                </div>

                {/* Section 5: Power Management */}
                <div className="space-y-1.5 border-l-2 border-yellow-500 pl-3">
                  <div className="flex items-center gap-1.5 text-yellow-400 font-bold uppercase tracking-wider text-xs">
                    <Zap size={14} />
                    <span>Battery & Power Conservation</span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    You start with 100% battery. Idle battery lasts <strong>500 seconds on Night 1</strong> (depletes ~1.5% faster on subsequent nights). Every active door, light, or camera adds extra power usage bars. Conserve power to avoid a fatal blackout!
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: how-to-play.png */}
              <div className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-neutral-900/60 p-4 sm:p-5 flex flex-col items-center justify-between space-y-3">
                <div className="w-full text-center space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 rounded">
                    SECURITY THREAT ADVISORY
                  </span>
                  <h4 className="text-sm font-black text-white tracking-wide">
                    SUBJECT: AB (ABHISHEK)
                  </h4>
                </div>

                {/* The Image: how-to-play.png */}
                <div className="relative w-full max-w-[240px] md:max-w-none rounded-xl overflow-hidden border-2 border-neutral-700 bg-neutral-950 shadow-[0_0_30px_rgba(0,0,0,0.9)] flex items-center justify-center p-2">
                  <img 
                    src="./assets/images/how-to-play.png" 
                    alt="Subject AB - How to Play Alert" 
                    loading="eager"
                    className="w-full max-h-64 sm:max-h-72 md:max-h-80 object-contain filter contrast-110 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  />
                  {/* CRT Scanline Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-60" />
                </div>

                {/* Warning Card */}
                <div className="w-full bg-red-950/40 border border-red-500/60 rounded-lg p-2.5 text-center space-y-1">
                  <p className="text-[11px] font-bold text-red-400 leading-tight">
                    WATCH OUT FOR THIS FACE!
                  </p>
                  <p className="text-[10px] text-gray-300 leading-tight">
                    If this appears in your doorway with the light on, do not wait — <strong className="text-yellow-300">SHUT THE DOOR [D]</strong> immediately!
                  </p>
                </div>

                <div className="w-full text-center">
                  <span className="text-[9px] text-gray-500 font-mono">
                    IDENTIFICATION LOG: IIT CHANTHAVILA #001
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
              <span className="text-emerald-400/90 text-center sm:text-left text-[10px] sm:text-[11px]">
                Tip: Wear headphones to listen for hallway footsteps and Dipu sprinting!
              </span>
              <button
                onClick={closeHowToPlay}
                className="w-full sm:w-auto px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded transition active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                UNDERSTOOD
              </button>
            </div>
          </div>
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
