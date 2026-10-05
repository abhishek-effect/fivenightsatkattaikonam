import React, { useState, useEffect, useRef } from 'react';
import { Zap, Lock, Unlock, Lightbulb, ShieldAlert, Pause, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import { getUsageBars } from '../game/gameEngine';
import { isAppFullscreen, toggleAppFullscreen } from '../utils/fullscreen';

export default function OfficeView({
  gameState,
  onToggleDoor,
  onToggleLight,
  onToggleMonitor,
  onPause,
  isDoorBanging,
}) {
  const [panX, setPanX] = useState(0); // -15 to +15% horizontal panning (or -28 to +28% on mobile)
  const [isPortrait, setIsPortrait] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(isAppFullscreen());
  const containerRef = useRef(null);
  const touchStartXRef = useRef(null);
  const currentPanRef = useRef(0);

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

  const handleToggleFullscreen = (e) => {
    e.stopPropagation();
    toggleAppFullscreen();
  };

  // Detect orientation / screen mode
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth mouse panning effect across office (Desktop)
  const handleMouseMove = (e) => {
    if (gameState.isMonitorOpen) return;
    const width = window.innerWidth;
    const clientX = e.clientX;
    const ratio = (clientX / width) * 2 - 1; // -1 to 1
    const maxPan = isPortrait ? 28 : 12;
    setPanX(ratio * maxPan);
  };

  // Touch Drag Panning (Mobile Chrome / Touchscreen)
  const handleTouchStart = (e) => {
    if (gameState.isMonitorOpen || !e.touches[0]) return;
    touchStartXRef.current = e.touches[0].clientX;
    currentPanRef.current = panX;
  };

  const handleTouchMove = (e) => {
    if (gameState.isMonitorOpen || touchStartXRef.current === null || !e.touches[0]) return;
    const clientX = e.touches[0].clientX;
    const diff = clientX - touchStartXRef.current;
    const maxPan = isPortrait ? 30 : 16;
    // Dragging left should rotate view right towards the door
    const newPan = currentPanRef.current - (diff / window.innerWidth) * (maxPan * 2.2);
    setPanX(Math.max(-maxPan, Math.min(maxPan, newPan)));
  };

  const handleTouchEnd = () => {
    touchStartXRef.current = null;
  };

  // Quick glance buttons for mobile thumbs
  const lookDesk = () => setPanX(isPortrait ? -26 : -12);
  const lookCenter = () => setPanX(0);
  const lookDoor = () => setPanX(isPortrait ? 26 : 12);

  const isLightActive = gameState.isLightOn && !gameState.isBlackout;
  const isDoorLocked = gameState.isDoorClosed && !gameState.isBlackout;

  // Usage bars visual
  const usageBars = typeof gameState?.getUsageBars === 'function' ? gameState.getUsageBars() : getUsageBars(gameState);
  const usageColors = ['bg-emerald-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600'];

  // Animatronics visibility when light is active (they stand outside door)
  const showAadeshAtDoor = isLightActive && gameState.aadesh.location === 'BLIND_SPOT' && !isDoorLocked;
  const showABAtDoor = isLightActive && gameState.ab.location === 'DOOR' && !isDoorLocked;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-screen min-h-[100dvh] h-[100dvh] overflow-hidden bg-black select-none touch-none ${
        isDoorBanging ? 'door-impact-shake' : ''
      }`}
    >
      {/* Blackout overlay */}
      {gameState.isBlackout && (
        <div className="absolute inset-0 bg-black z-35 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-12 flicker-blackout">
              <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_25px_#22d3ee]" />
              <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_25px_#22d3ee]" />
            </div>
            <p className="text-red-600 font-mono tracking-widest text-sm animate-pulse">TOTAL POWER FAILURE</p>
          </div>
        </div>
      )}

      {/* Panoramic Office Room View - Adaptive width for Desktop & Mobile */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          width: isPortrait ? '230vw' : '120vw',
          left: isPortrait ? '-65vw' : '-10vw',
          transform: `translateX(${-panX}%)`
        }}
      >
        {/* Main Office Image: Door Open Layer */}
        <img
          src="./assets/images/office-door-open.jpg"
          alt="Office Door Open"
          loading="eager"
          decoding="sync"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${
            gameState.isBlackout
              ? 'brightness-[0.04] contrast-200'
              : isLightActive
                ? 'brightness-120 contrast-110 saturate-110'
                : 'brightness-[0.58] contrast-125'
          } ${isDoorLocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        />

        {/* Main Office Image: Door Closed Layer */}
        <img
          src="./assets/images/office-door-closed.jpg"
          alt="Office Door Closed"
          loading="eager"
          decoding="sync"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-100 ${
            gameState.isBlackout
              ? 'brightness-[0.04] contrast-200'
              : isLightActive
                ? 'brightness-120 contrast-110 saturate-110'
                : 'brightness-[0.58] contrast-125'
          } ${isDoorLocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        />

        {/* PRECISE DOORWAY & WINDOW DARKNESS MASKS (Only corridor area outside is pitch black, door frame stays visible) */}
        {!isLightActive && !gameState.isBlackout && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 640 480"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Subtle edge softening filter so the pitch black merges cleanly into the door frame */}
              <filter id="corridor-darkness-blur" x="-5%" y="-5%" width="110%" height="110%">
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
              {/* Menacing glowing red eyes filter */}
              <filter id="red-eye-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* When Door is OPEN: Only the corridor opening outside is pitch black. Door frame and swung door stay visible! */}
            {!isDoorLocked && (
              <polygon
                points="323,72 435,76 418,340 305,340"
                fill="#000000"
                filter="url(#corridor-darkness-blur)"
              />
            )}

            {/* When Door is CLOSED: Only the upper window showing the corridor is pitch black. Door frame and lower panel stay visible! */}
            {isDoorLocked && (
              <g>
                <polygon
                  points="337,114 440,116 444,268 331,267"
                  fill="#000000"
                  filter="url(#corridor-darkness-blur)"
                />

                {/* RED EYES: Only appear when light is off, door is closed, and animatronic is banging on the door */}
                {isDoorBanging && (
                  <g className="animate-pulse" filter="url(#red-eye-glow)">
                    {/* Glowing Red Eyes peering into office through the dark top window */}
                    <ellipse cx="376" cy="182" rx="4.5" ry="4" fill="#ff1a1a" />
                    <circle cx="376" cy="182" r="2" fill="#ffffff" opacity="0.85" />
                    <ellipse cx="402" cy="182" rx="4.5" ry="4" fill="#ff1a1a" />
                    <circle cx="402" cy="182" r="2" fill="#ffffff" opacity="0.85" />
                  </g>
                )}
              </g>
            )}
          </svg>
        )}

        {/* HALLWAY LIGHT ILLUMINATION BEAM */}
        {isLightActive && (
          <>
            <div 
              className="absolute inset-y-0 pointer-events-none mix-blend-screen transition-opacity duration-150 z-10"
              style={{
                left: '44%',
                width: '42%',
                background: 'radial-gradient(ellipse 85% 90% at 50% 45%, rgba(255, 252, 230, 0.85) 0%, rgba(255, 240, 180, 0.5) 45%, rgba(255, 215, 120, 0.2) 75%, transparent 100%)'
              }}
            />
            <div className="absolute inset-0 pointer-events-none bg-amber-400/5 mix-blend-color-dodge z-10" />
          </>
        )}

        {/* Ambient Dark Security Room Tint when light is OFF */}
        {!isLightActive && !gameState.isBlackout && (
          <div className="absolute inset-0 bg-blue-950/25 pointer-events-none mix-blend-multiply z-5" />
        )}

        {/* THREAT EXPOSED BY LIGHT: Aadesh standing at the open doorway */}
        {showAadeshAtDoor && (
          <div className="absolute top-[22%] left-[54%] w-60 sm:w-64 md:w-84 pointer-events-none animate-pulse z-20 transition-all duration-100">
            <img 
              src="./assets/images/aadesh-jumpscare-cutout.png" 
              alt="Aadesh at Doorway" 
              loading="eager"
              decoding="sync"
              className="w-full object-contain filter contrast-125 drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]"
            />
          </div>
        )}

        {/* THREAT EXPOSED BY LIGHT: AB standing at the open doorway */}
        {showABAtDoor && (
          <div className="absolute bottom-[14%] left-[52%] w-64 sm:w-72 md:w-96 pointer-events-none animate-pulse z-20 transition-all duration-100">
            <img 
              src="./assets/images/ab-cutout.png" 
              alt="AB at Open Doorway" 
              loading="eager"
              decoding="sync"
              className="w-full object-contain filter contrast-125 drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]"
            />
          </div>
        )}

        {/* DOOR KNOCK / BANG IMPACT EFFECT: Positioned on the lower door panel to never collide with the red eyes in the top window */}
        {isDoorBanging && (
          <div className="absolute top-[64%] left-[60.5%] -translate-x-1/2 z-30 pointer-events-none animate-bounce">
            <div className="bg-red-600/90 text-white font-mono font-black text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-yellow-300 shadow-[0_0_30px_rgba(220,38,38,1)] flex items-center gap-2">
              <ShieldAlert size={18} className="text-yellow-300 animate-spin" />
              <span>BANG! BANG! BANG!</span>
            </div>
          </div>
        )}

        {/* Classic Spinning Security Desk Fan (Mounted in lower-left on counter) */}
        <div className="absolute bottom-10 left-[18%] z-15 pointer-events-none">
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            <div className="absolute bottom-2 w-20 sm:w-24 h-4 bg-neutral-900 border border-neutral-700 rounded-full" />
            <div className="absolute bottom-5 w-4 sm:w-5 h-14 sm:h-16 bg-neutral-800" />
            <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-neutral-600 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
              <div className={`relative w-20 h-20 sm:w-24 sm:h-24 ${!gameState.isBlackout ? 'fan-rotating' : ''}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-600 z-10 shadow-[0_0_8px_#06b6d4]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 sm:w-4 h-10 sm:h-12 bg-neutral-300 rounded-full shadow" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3.5 sm:w-4 h-10 sm:h-12 bg-neutral-300 rounded-full shadow" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-10 sm:w-12 h-3.5 sm:h-4 bg-neutral-300 rounded-full shadow" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-10 sm:w-12 h-3.5 sm:h-4 bg-neutral-300 rounded-full shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Door & Light Control Wall Panel */}
        <div className="absolute top-1/3 right-[12%] sm:right-[14%] z-25 bg-neutral-950/95 border-2 border-neutral-700 rounded-xl p-2.5 sm:p-3.5 shadow-2xl flex flex-col items-center gap-3.5 sm:gap-5 backdrop-blur-sm">
          <div className="text-[10px] sm:text-[11px] font-bold text-gray-400 font-mono tracking-widest border-b border-neutral-800 pb-1 w-full text-center">
            CONTROLS
          </div>

          {/* DOOR LOCK BUTTON */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onToggleDoor}
              disabled={gameState.isBlackout}
              className={`w-14 h-14 sm:w-18 sm:h-18 rounded-full border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-90 shadow-xl cursor-pointer ${
                isDoorLocked
                  ? 'bg-red-700 border-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.9)] animate-pulse'
                  : 'bg-emerald-950 border-emerald-600 text-emerald-300 hover:bg-emerald-900'
              }`}
              title="Toggle Security Door [D]"
            >
              {isDoorLocked ? <Lock size={20} /> : <Unlock size={20} />}
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-wider font-mono">DOOR</span>
            </button>
            <span className={`text-[9px] sm:text-[10px] font-bold font-mono tracking-wider ${isDoorLocked ? 'text-red-400' : 'text-emerald-400'}`}>
              {isDoorLocked ? '● CLOSED' : '○ OPEN'}
            </span>
          </div>

          {/* HALLWAY LIGHT BUTTON */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onToggleLight}
              disabled={gameState.isBlackout}
              className={`w-14 h-14 sm:w-18 sm:h-18 rounded-full border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-90 shadow-xl cursor-pointer ${
                isLightActive
                  ? 'bg-yellow-400 border-white text-black shadow-[0_0_30px_rgba(250,204,21,1)]'
                  : 'bg-neutral-800 border-neutral-600 text-gray-400 hover:bg-neutral-700 hover:text-white'
              }`}
              title="Toggle Hallway Light [L]"
            >
              <Lightbulb size={20} className={isLightActive ? 'text-black' : 'text-gray-400'} />
              <span className="text-[9px] sm:text-[10px] mt-0.5 tracking-wider font-mono">LIGHT</span>
            </button>
            <span className={`text-[9px] sm:text-[10px] font-bold font-mono tracking-wider ${isLightActive ? 'text-yellow-400' : 'text-gray-500'}`}>
              {isLightActive ? '● ON' : '○ OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE QUICK-LOOK THUMB GLANCE BUTTONS (Allows immediate snap between desk & door on phones) */}
      {isPortrait && (
        <>
          <button
            onClick={lookDesk}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 px-2 py-3 bg-black/75 border border-neutral-700 rounded-r-lg text-gray-400 hover:text-white font-mono text-[10px] flex flex-col items-center gap-1 shadow-lg active:scale-95"
            title="Look at Desk"
          >
            <ChevronLeft size={16} />
            <span className="[writing-mode:vertical-lr]">DESK</span>
          </button>

          <button
            onClick={lookDoor}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 px-2 py-3 bg-black/75 border border-neutral-700 rounded-l-lg text-gray-400 hover:text-white font-mono text-[10px] flex flex-col items-center gap-1 shadow-lg active:scale-95"
            title="Look at Door"
          >
            <ChevronRight size={16} />
            <span className="[writing-mode:vertical-lr]">DOOR</span>
          </button>
        </>
      )}

      {/* Top Left: Power Meter */}
      <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-30 bg-black/85 backdrop-blur border border-neutral-800 p-2 sm:p-3 rounded-lg space-y-1 pointer-events-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Zap size={15} className={gameState.power > 20 ? 'text-emerald-400' : 'text-red-500 animate-pulse'} />
          <span className="text-[10px] sm:text-xs font-bold tracking-wider text-gray-300 font-mono">POWER:</span>
          <span className={`text-xs sm:text-base font-bold font-mono ${
            gameState.power > 50 ? 'text-emerald-400' : gameState.power > 20 ? 'text-yellow-400' : 'text-red-500'
          }`}>
            {Math.round(gameState.power)}%
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-gray-400 text-[9px] sm:text-[10px]">USE:</span>
          <div className="flex gap-0.5 sm:gap-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div 
                key={bar} 
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm border border-black/40 ${
                  bar <= usageBars ? usageColors[bar - 1] : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Right: Time Clock & Night */}
      <div className="absolute top-3 sm:top-6 right-3 sm:right-6 z-30 bg-black/85 backdrop-blur border border-neutral-800 p-2 sm:p-3 rounded-lg text-right pointer-events-none">
        <div className="text-lg sm:text-2xl font-black font-mono tracking-widest text-white leading-tight">
          {gameState.time === 0 ? '12' : gameState.time} AM
        </div>
        <div className="text-[9px] sm:text-[11px] text-red-500 font-bold uppercase tracking-widest font-mono">
          NIGHT {gameState.night}
        </div>
      </div>

      {/* Top Center: Pause & Fullscreen Buttons */}
      <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        {onPause && (
          <button
            onClick={onPause}
            disabled={gameState.isBlackout}
            className="px-2.5 py-1 sm:px-3.5 sm:py-2 bg-black/85 hover:bg-neutral-800 border border-neutral-700 hover:border-yellow-400 text-gray-300 hover:text-yellow-300 rounded-lg font-mono text-[10px] sm:text-xs tracking-wider flex items-center gap-1 sm:gap-2 transition-all shadow-lg cursor-pointer active:scale-95"
            title="Pause Shift [ESC]"
          >
            <Pause size={12} className="text-yellow-400" />
            <span>PAUSE</span>
          </button>
        )}

        <button
          onClick={handleToggleFullscreen}
          disabled={gameState.isBlackout}
          className="px-2 py-1 sm:px-3 sm:py-2 bg-black/85 hover:bg-neutral-800 border border-yellow-600/70 hover:border-yellow-400 text-yellow-400 hover:text-yellow-300 rounded-lg font-mono text-[10px] sm:text-xs tracking-wider flex items-center gap-1 sm:gap-1.5 transition-all shadow-lg cursor-pointer active:scale-95"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Mobile/PC)'}
        >
          {isFullscreen ? <Minimize size={12} className="text-yellow-400" /> : <Maximize size={12} className="text-yellow-400" />}
          <span>{isFullscreen ? 'EXIT' : 'FULL'}</span>
        </button>
      </div>

      {/* Bottom Center: CCTV Surveillance Flip Trigger */}
      <div className="absolute bottom-0 inset-x-0 z-30 flex justify-center pb-1 sm:pb-2 px-2 sm:px-3 pointer-events-auto">
        <button
          onClick={onToggleMonitor}
          disabled={gameState.isBlackout}
          className="group w-full max-w-[210px] sm:max-w-md py-1.5 sm:py-2.5 bg-neutral-900/95 hover:bg-neutral-800 border sm:border-2 border-neutral-600 hover:border-emerald-400 rounded-t-lg sm:rounded-t-xl transition-all duration-150 flex items-center justify-center gap-1.5 sm:gap-2.5 shadow-[0_-5px_25px_rgba(0,0,0,0.9)] cursor-pointer active:scale-95"
          title="Open CCTV Cameras [SPACE]"
        >
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 group-hover:animate-ping" />
          <span className="text-[10px] sm:text-xs md:text-sm font-bold tracking-wider sm:tracking-widest text-gray-100 group-hover:text-emerald-300 uppercase font-mono">
            ▲ SURVEILLANCE CAMERAS <span className="hidden sm:inline">[SPACE]</span>
          </span>
        </button>
      </div>

      {/* Retro CRT Scanlines & Screen Vignette */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
