import React, { useState, useEffect, useRef } from 'react';
import { Zap, Lock, Unlock, Lightbulb, ShieldAlert, Pause } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import { getUsageBars } from '../game/gameEngine';

export default function OfficeView({
  gameState,
  onToggleDoor,
  onToggleLight,
  onToggleMonitor,
  onPause,
  isDoorBanging,
}) {
  const [panX, setPanX] = useState(0); // -10 to +10% horizontal panning
  const containerRef = useRef(null);

  // Smooth mouse panning effect across office
  const handleMouseMove = (e) => {
    if (gameState.isMonitorOpen) return;
    const width = window.innerWidth;
    const clientX = e.clientX;
    const ratio = (clientX / width) * 2 - 1; // -1 to 1
    setPanX(ratio * 10);
  };

  const isLightActive = gameState.isLightOn && !gameState.isBlackout;
  const isDoorLocked = gameState.isDoorClosed && !gameState.isBlackout;

  // Usage bars visual
  const usageBars = typeof gameState?.getUsageBars === 'function' ? gameState.getUsageBars() : getUsageBars(gameState);
  const usageColors = ['bg-emerald-500', 'bg-emerald-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600'];

  // Animatronics visibility when light is active (they stand outside door for 5s)
  const showAadeshAtDoor = isLightActive && gameState.aadesh.location === 'BLIND_SPOT' && !isDoorLocked;
  const showABAtDoor = isLightActive && gameState.ab.location === 'DOOR' && !isDoorLocked;

  // Lurking threat indicator in the pitch dark doorway
  const threatInDarkness = !isLightActive && !gameState.isBlackout && !isDoorLocked && 
    (gameState.ab.location === 'DOOR' || gameState.aadesh.location === 'BLIND_SPOT');

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-screen h-screen overflow-hidden bg-black select-none ${
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

      {/* Panoramic Office Room View - Uses the actual DoorOpen and DoorClosed images */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{
          width: '120vw',
          left: '-10vw',
          transform: `translateX(${-panX}%)`
        }}
      >
        {/* Main Office Image (Door area is shrouded in darkness unless Light is turned ON) */}
        <img
          src={isDoorLocked ? './assets/images/office-door-closed.jpg' : './assets/images/office-door-open.jpg'}
          alt={isDoorLocked ? 'Door Closed' : 'Door Open'}
          className={`w-full h-full object-cover transition-all duration-150 ${
            gameState.isBlackout
              ? 'brightness-[0.04] contrast-200'
              : isLightActive
                ? 'brightness-120 contrast-110 saturate-110'
                : 'brightness-[0.58] contrast-125'
          }`}
        />

        {/* DOORWAY DARKNESS SHROUD: When hallway Light is OFF, the doorway is pitch black */}
        {!isLightActive && !gameState.isBlackout && (
          <div 
            className="absolute inset-y-0 pointer-events-none transition-opacity duration-200 z-10 flex items-center justify-center"
            style={{
              left: '46%',
              width: '38%',
              background: 'radial-gradient(ellipse 95% 90% at 50% 50%, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 65%, rgba(0,0,0,0.6) 88%, transparent 100%)'
            }}
          >
            {/* Subtle red eye reflection when an animatronic stands lurking in the dark doorway */}
            {threatInDarkness && (
              <div className="absolute top-[38%] left-[45%] flex gap-5 items-center pointer-events-none animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_12px_#dc2626] opacity-80" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_12px_#dc2626] opacity-80" />
              </div>
            )}
          </div>
        )}

        {/* HALLWAY LIGHT ILLUMINATION BEAM: Casts bright light onto the door/hallway */}
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
          <div className="absolute top-[22%] left-[54%] w-64 md:w-84 pointer-events-none animate-pulse z-20 transition-all duration-100">
            <img 
              src="./assets/images/aadesh-jumpscare-cutout.png" 
              alt="Aadesh at Doorway" 
              className="w-full object-contain filter contrast-125 drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]"
            />
          </div>
        )}

        {/* THREAT EXPOSED BY LIGHT: AB standing at the open doorway */}
        {showABAtDoor && (
          <div className="absolute bottom-[14%] left-[52%] w-72 md:w-96 pointer-events-none animate-pulse z-20 transition-all duration-100">
            <img 
              src="./assets/images/ab-cutout.png" 
              alt="AB at Open Doorway" 
              className="w-full object-contain filter contrast-125 drop-shadow-[0_0_40px_rgba(255,255,255,0.9)]"
            />
          </div>
        )}

        {/* DOOR KNOCK / BANG IMPACT EFFECT */}
        {isDoorBanging && (
          <div className="absolute top-[28%] left-[56%] z-30 pointer-events-none animate-bounce">
            <div className="bg-red-600/90 text-white font-mono font-black text-sm px-4 py-2 rounded-lg border-2 border-yellow-300 shadow-[0_0_30px_rgba(220,38,38,1)] flex items-center gap-2">
              <ShieldAlert size={20} className="text-yellow-300 animate-spin" />
              <span>BANG! BANG! BANG!</span>
            </div>
          </div>
        )}

        {/* Classic Spinning Security Desk Fan (Mounted in lower-left on the counter) */}
        <div className="absolute bottom-10 left-[18%] z-15 pointer-events-none">
          <div className="relative w-36 h-36 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            <div className="absolute bottom-2 w-24 h-4 bg-neutral-900 border border-neutral-700 rounded-full" />
            <div className="absolute bottom-5 w-5 h-16 bg-neutral-800" />
            <div className="absolute w-28 h-28 rounded-full border-2 border-neutral-600 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
              <div className={`relative w-24 h-24 ${!gameState.isBlackout ? 'fan-rotating' : ''}`}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-600 z-10 shadow-[0_0_8px_#06b6d4]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-neutral-300 rounded-full shadow" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-neutral-300 rounded-full shadow" />
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-12 h-4 bg-neutral-300 rounded-full shadow" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-12 h-4 bg-neutral-300 rounded-full shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Door & Light Control Wall Panel (Positioned right beside the doorway) */}
        <div className="absolute top-1/3 right-[14%] z-25 bg-neutral-950/95 border-2 border-neutral-700 rounded-xl p-3.5 shadow-2xl flex flex-col items-center gap-5 backdrop-blur-sm">
          <div className="text-[11px] font-bold text-gray-400 font-mono tracking-widest border-b border-neutral-800 pb-1 w-full text-center">
            DOOR CONTROLS
          </div>

          {/* DOOR LOCK BUTTON */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={onToggleDoor}
              disabled={gameState.isBlackout}
              className={`w-18 h-18 rounded-full border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-95 shadow-xl cursor-pointer ${
                isDoorLocked
                  ? 'bg-red-700 border-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.9)] animate-pulse'
                  : 'bg-emerald-950 border-emerald-600 text-emerald-300 hover:bg-emerald-900'
              }`}
              title="Toggle Security Door [D]"
            >
              {isDoorLocked ? <Lock size={22} /> : <Unlock size={22} />}
              <span className="text-[10px] mt-0.5 tracking-wider font-mono">DOOR</span>
            </button>
            <span className={`text-[10px] font-bold font-mono tracking-wider ${isDoorLocked ? 'text-red-400' : 'text-emerald-400'}`}>
              {isDoorLocked ? '● CLOSED [D]' : '○ OPEN [D]'}
            </span>
          </div>

          {/* HALLWAY LIGHT BUTTON */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={onToggleLight}
              disabled={gameState.isBlackout}
              className={`w-18 h-18 rounded-full border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-95 shadow-xl cursor-pointer ${
                isLightActive
                  ? 'bg-yellow-400 border-white text-black shadow-[0_0_30px_rgba(250,204,21,1)]'
                  : 'bg-neutral-800 border-neutral-600 text-gray-400 hover:bg-neutral-700 hover:text-white'
              }`}
              title="Toggle Hallway Light [L]"
            >
              <Lightbulb size={22} className={isLightActive ? 'text-black' : 'text-gray-400'} />
              <span className="text-[10px] mt-0.5 tracking-wider font-mono">LIGHT</span>
            </button>
            <span className={`text-[10px] font-bold font-mono tracking-wider ${isLightActive ? 'text-yellow-400' : 'text-gray-500'}`}>
              {isLightActive ? '● ON [L]' : '○ OFF [L]'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Left: Power Meter */}
      <div className="absolute top-6 left-6 z-30 bg-black/85 backdrop-blur border border-neutral-800 p-3.5 rounded-lg space-y-1.5 pointer-events-none">
        <div className="flex items-center gap-2">
          <Zap size={18} className={gameState.power > 20 ? 'text-emerald-400' : 'text-red-500 animate-pulse'} />
          <span className="text-xs font-bold tracking-wider text-gray-300 font-mono">POWER:</span>
          <span className={`text-base font-bold font-mono ${
            gameState.power > 50 ? 'text-emerald-400' : gameState.power > 20 ? 'text-yellow-400' : 'text-red-500'
          }`}>
            {Math.round(gameState.power)}%
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-gray-400 text-[10px]">USAGE:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div 
                key={bar} 
                className={`w-3 h-3 rounded-sm border border-black/40 ${
                  bar <= usageBars ? usageColors[bar - 1] : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Right: Time Clock & Night */}
      <div className="absolute top-6 right-6 z-30 bg-black/85 backdrop-blur border border-neutral-800 p-3.5 rounded-lg text-right pointer-events-none">
        <div className="text-2xl font-black font-mono tracking-widest text-white">
          {gameState.time === 0 ? '12' : gameState.time} AM
        </div>
        <div className="text-[11px] text-red-500 font-bold uppercase tracking-widest font-mono">
          NIGHT {gameState.night}
        </div>
      </div>

      {/* Top Center: Pause Button */}
      {onPause && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <button
            onClick={onPause}
            disabled={gameState.isBlackout}
            className="px-4 py-2 bg-black/85 hover:bg-neutral-800 border border-neutral-700 hover:border-yellow-400 text-gray-300 hover:text-yellow-300 rounded-lg font-mono text-xs tracking-wider flex items-center gap-2 transition-all shadow-[0_2px_15px_rgba(0,0,0,0.8)] cursor-pointer group"
            title="Pause Shift [ESC]"
          >
            <Pause size={14} className="text-yellow-400 group-hover:scale-125 transition-transform" />
            <span>PAUSE [ESC]</span>
          </button>
        </div>
      )}

      {/* Bottom Center: CCTV Surveillance Flip Trigger */}
      <div className="absolute bottom-0 inset-x-0 z-30 flex justify-center pb-2 pointer-events-auto">
        <button
          onClick={onToggleMonitor}
          disabled={gameState.isBlackout}
          className="group px-14 py-3 bg-neutral-900/95 hover:bg-neutral-800 border-2 border-neutral-500 hover:border-emerald-400 rounded-t-xl transition-all duration-150 flex items-center gap-3 shadow-[0_-5px_25px_rgba(0,0,0,0.9)] cursor-pointer"
          title="Press SPACE or Click to Open CCTV Cameras"
        >
          <div className="w-3 h-3 rounded-full bg-emerald-500 group-hover:animate-ping" />
          <span className="text-sm font-bold tracking-widest text-gray-100 group-hover:text-emerald-300 uppercase font-mono">
            ▲ OPEN SURVEILLANCE CAMERAS [SPACE]
          </span>
        </button>
      </div>

      {/* Retro CRT Scanlines & Screen Vignette */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
