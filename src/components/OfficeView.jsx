import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Clock, Eye, Lock, Unlock, Lightbulb } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';

export default function OfficeView({
  gameState,
  onToggleDoor,
  onToggleLight,
  onToggleMonitor,
}) {
  const [panX, setPanX] = useState(0); // -15 to +15% horizontal panning
  const containerRef = useRef(null);

  // Smooth mouse panning effect across office
  const handleMouseMove = (e) => {
    if (gameState.isMonitorOpen) return;
    const width = window.innerWidth;
    const clientX = e.clientX;
    const ratio = (clientX / width) * 2 - 1; // -1 to 1
    // Clamp to -18% to 18% pan
    setPanX(ratio * 16);
  };

  const isLightActive = gameState.isLightOn && !gameState.isBlackout;
  const isDoorLocked = gameState.isDoorClosed && !gameState.isBlackout;

  // Usage bars visual
  const usageBars = gameState.getUsageBars();
  const usageColors = ['bg-green-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-600'];

  // Animatronics visibility in doorway
  const showAadeshAtDoor = isLightActive && gameState.aadesh.location === 'BLIND_SPOT' && !isDoorLocked;
  const showABAtDoor = isLightActive && gameState.ab.location === 'DOOR' && !isDoorLocked;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen overflow-hidden bg-neutral-950 select-none cursor-crosshair"
    >
      {/* Blackout darkness overlay */}
      {gameState.isBlackout && (
        <div className="absolute inset-0 bg-black z-30 flex items-center justify-center">
          <div className="text-center space-y-4">
            {/* Glowing eyes of AB in darkness */}
            <div className="flex justify-center gap-12 flicker-blackout">
              <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />
              <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-[0_0_20px_#22d3ee]" />
            </div>
            <p className="text-red-600 font-mono tracking-widest text-xs animate-pulse">POWER FAILURE</p>
          </div>
        </div>
      )}

      {/* Panoramic Office Room Container */}
      <div 
        className="absolute top-0 bottom-0 flex transition-transform duration-100 ease-out"
        style={{
          width: '130vw',
          left: '-15vw',
          transform: `translateX(${-panX}%)`
        }}
      >
        {/* Left Office Wall & Desk */}
        <div className="w-1/2 h-full relative bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-r border-neutral-800 flex items-end pb-12 pl-16">
          {/* Posters & notice board on wall */}
          <div className="absolute top-16 left-20 w-44 h-56 bg-neutral-800/80 border border-neutral-700 p-3 shadow-lg rotate-[-2deg] rounded">
            <div className="w-full h-4 bg-red-700 text-white text-[10px] font-bold text-center leading-4">RULES FOR SAFETY</div>
            <div className="text-[9px] text-gray-300 mt-2 space-y-1 font-mono">
              <p>1. Keep doors open to conserve power.</p>
              <p>2. Check CAM 3 regularly.</p>
              <p>3. Use door light before looking away.</p>
              <p>4. In case of anomaly: LOCK IN.</p>
            </div>
          </div>

          {/* College Calendar / Photo */}
          <div className="absolute top-20 left-72 w-32 h-40 bg-neutral-800 border border-yellow-700/60 p-2 shadow-md rotate-[3deg]">
            <div className="text-[10px] font-bold text-yellow-500 text-center">KATTAIKONAM</div>
            <div className="w-full h-24 bg-neutral-900 mt-1 border border-neutral-700 flex items-center justify-center text-xs text-gray-400">
              CAMPUS
            </div>
          </div>

          {/* Desk Area with Spinning Security Fan */}
          <div className="relative z-10 w-96 bg-neutral-900 border-t-4 border-neutral-700 rounded-t-lg p-6 shadow-2xl flex items-center justify-between">
            {/* The Famous Animated FNAF Desk Fan */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Fan Base */}
              <div className="absolute bottom-0 w-20 h-4 bg-neutral-800 border border-neutral-600 rounded-full" />
              <div className="absolute bottom-3 w-4 h-12 bg-neutral-700" />
              {/* Fan Cage */}
              <div className="absolute w-24 h-24 rounded-full border-2 border-neutral-500/80 flex items-center justify-center">
                {/* Fan Blades (Spinning if power > 0) */}
                <div className={`relative w-20 h-20 ${!gameState.isBlackout ? 'fan-rotating' : ''}`}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 z-10" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-10 bg-neutral-400/90 rounded-full" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-10 bg-neutral-400/90 rounded-full" />
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-3 bg-neutral-400/90 rounded-full" />
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-3 bg-neutral-400/90 rounded-full" />
                </div>
              </div>
            </div>

            {/* Coffee mug & papers on desk */}
            <div className="space-y-2 font-mono text-[10px] text-gray-400">
              <div className="w-10 h-12 bg-red-900/60 border border-red-700 rounded-t flex items-center justify-center text-[8px] text-white">
                FNAK
              </div>
              <div className="text-[11px] text-neutral-400">DUTY OFFICER</div>
              <div className="text-[10px] text-green-400">ONLINE ●</div>
            </div>
          </div>
        </div>

        {/* Right Office Wall & Doorway */}
        <div className="w-1/2 h-full relative bg-neutral-900 flex items-center justify-center p-8">
          {/* Door Frame & Hallway View */}
          <div className="relative w-[340px] md:w-[420px] h-[520px] md:h-[600px] border-8 border-neutral-800 bg-black rounded shadow-2xl overflow-hidden">
            {/* The Actual Doorway Image from user assets */}
            <img 
              src={isDoorLocked ? './assets/images/office-door-closed.jpg' : './assets/images/office-door-open.jpg'} 
              alt="Security Doorway"
              className={`w-full h-full object-cover transition-opacity duration-150 ${
                isLightActive 
                  ? 'brightness-125 contrast-110' 
                  : 'brightness-[0.25] contrast-150'
              }`}
            />

            {/* Light Cone Effect */}
            {isLightActive && (
              <div className="absolute inset-0 bg-yellow-400/10 pointer-events-none mix-blend-screen" />
            )}

            {/* Threat Presence: Aadesh at doorway blind spot */}
            {showAadeshAtDoor && (
              <div className="absolute inset-0 z-20 flex items-center justify-center animate-pulse">
                <img 
                  src="./assets/images/aadesh-jumpscare.jpg" 
                  alt="Aadesh Lurking" 
                  className="w-4/5 h-4/5 object-contain filter drop-shadow-[0_0_25px_rgba(255,0,0,0.8)] scale-110"
                />
              </div>
            )}

            {/* Threat Presence: AB at open doorway */}
            {showABAtDoor && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-3/4 flex items-center justify-center animate-pulse">
                <img 
                  src="./assets/images/ab-cutout.png" 
                  alt="AB Outside Door" 
                  className="w-full object-contain filter drop-shadow-[0_0_30px_rgba(220,38,38,0.9)] scale-105"
                />
              </div>
            )}

            {/* Heavy Door Sliding Overlay Graphic for dramatic mechanical effect */}
            {isDoorLocked && (
              <div className="absolute inset-x-0 top-0 h-8 bg-neutral-800 border-b-2 border-red-600 flex items-center justify-center text-[10px] font-bold text-red-500 tracking-wider">
                LOCKDOWN ENGAGED
              </div>
            )}
          </div>

          {/* Door & Light Control Industrial Wall Panel */}
          <div className="ml-6 w-24 bg-neutral-950 border-2 border-neutral-700 rounded-lg p-3 flex flex-col gap-5 shadow-2xl">
            <div className="text-[10px] font-bold text-neutral-400 text-center tracking-widest border-b border-neutral-800 pb-1">
              PANEL
            </div>

            {/* DOOR LOCK BUTTON */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onToggleDoor}
                disabled={gameState.isBlackout}
                className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-95 shadow-lg ${
                  isDoorLocked
                    ? 'bg-red-700 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.8)]'
                    : 'bg-green-950 border-green-600 text-green-300 hover:bg-green-900'
                }`}
                title="Toggle Door Lock [D]"
              >
                {isDoorLocked ? <Lock size={20} /> : <Unlock size={20} />}
                <span className="text-[9px] mt-0.5 tracking-tighter">DOOR</span>
              </button>
              <span className={`text-[9px] font-bold ${isDoorLocked ? 'text-red-400' : 'text-green-500'}`}>
                {isDoorLocked ? 'SHUT' : 'OPEN'}
              </span>
            </div>

            {/* HALLWAY LIGHT BUTTON */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onToggleLight}
                disabled={gameState.isBlackout}
                className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center font-bold text-xs transition active:scale-95 shadow-lg ${
                  isLightActive
                    ? 'bg-yellow-500 border-white text-black shadow-[0_0_25px_rgba(234,179,8,1)]'
                    : 'bg-neutral-800 border-neutral-600 text-gray-400 hover:bg-neutral-700'
                }`}
                title="Toggle Hallway Light [L]"
              >
                <Lightbulb size={20} />
                <span className="text-[9px] mt-0.5 tracking-tighter">LIGHT</span>
              </button>
              <span className={`text-[9px] font-bold ${isLightActive ? 'text-yellow-400' : 'text-gray-500'}`}>
                {isLightActive ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Left: Power & Battery Gauge */}
      <div className="absolute top-6 left-6 z-20 bg-black/80 backdrop-blur border border-neutral-800 p-4 rounded-lg space-y-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <Zap size={18} className={gameState.power > 20 ? 'text-green-400' : 'text-red-500 animate-pulse'} />
          <span className="text-sm font-bold tracking-wider text-gray-200">POWER LEFT:</span>
          <span className={`text-lg font-bold font-mono ${
            gameState.power > 50 ? 'text-green-400' : gameState.power > 20 ? 'text-yellow-400' : 'text-red-500'
          }`}>
            {Math.round(gameState.power)}%
          </span>
        </div>

        {/* Usage Level Meter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 tracking-wider">USAGE:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div 
                key={bar} 
                className={`w-3.5 h-3.5 rounded-sm border border-black/40 ${
                  bar <= usageBars ? usageColors[bar - 1] : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Top Right: Clock & Night Indicator */}
      <div className="absolute top-6 right-6 z-20 bg-black/80 backdrop-blur border border-neutral-800 p-4 rounded-lg text-right pointer-events-none">
        <div className="text-3xl font-extrabold font-mono tracking-widest text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]">
          {gameState.time === 0 ? '12' : gameState.time} AM
        </div>
        <div className="text-xs text-red-500 font-bold uppercase tracking-widest mt-1">
          NIGHT {gameState.night}
        </div>
      </div>

      {/* Bottom Center: CCTV Tablet Monitor Flip Trigger */}
      <div className="absolute bottom-0 inset-x-0 z-30 flex justify-center pb-2 pointer-events-auto">
        <button
          onClick={onToggleMonitor}
          disabled={gameState.isBlackout}
          className="group px-12 py-3 bg-neutral-900/90 hover:bg-neutral-800 border-2 border-neutral-600 hover:border-red-500 rounded-t-xl transition-all duration-150 flex items-center gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]"
          title="Press SPACE or Click to Flip Monitor"
        >
          <div className="w-3 h-3 rounded-full bg-red-600 group-hover:animate-ping" />
          <span className="text-sm font-bold tracking-widest text-gray-200 group-hover:text-white uppercase font-mono">
            {gameState.isMonitorOpen ? '▼ CLOSE SURVEILLANCE' : '▲ FLIP SURVEILLANCE MONITOR [SPACE]'}
          </span>
        </button>
      </div>

      {/* CRT Scanline FX */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
    </div>
  );
}
