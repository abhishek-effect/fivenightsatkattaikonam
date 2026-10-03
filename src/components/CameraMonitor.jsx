import React, { useState } from 'react';
import { Camera, AlertTriangle, Radio, Shield, MapPin } from 'lucide-react';
import { CAMERAS } from '../game/gameEngine';
import { soundManager } from '../audio/SoundManager';

export default function CameraMonitor({
  gameState,
  onSelectCam,
  onToggleMonitor,
}) {
  const [switchingStatic, setSwitchingStatic] = useState(false);

  const activeCam = CAMERAS.find(c => c.id === gameState.currentCam) || CAMERAS[0];

  const handleCameraChange = (camId) => {
    if (camId === gameState.currentCam) return;
    soundManager.playStaticBurst(0.12, 0.25);
    setSwitchingStatic(true);
    onSelectCam(camId);
    setTimeout(() => {
      setSwitchingStatic(false);
    }, 100);
  };

  // Determine which animatronics are in the active room and use transparent cutouts
  const getActiveRoomThreats = () => {
    const threats = [];

    // AADESH: uses clean transparent cutouts based on location!
    if (gameState.currentCam === 'CAM_4' && gameState.aadesh.location === 'CAM_4') {
      threats.push({
        name: 'AADESH',
        photo: './assets/images/aadesh-sideways-cutout.png',
        pose: 'Sneaking by Stairs',
        posClass: 'bottom-8 left-[30%] w-44 md:w-56'
      });
    } else if (gameState.currentCam === 'CAM_2' && gameState.aadesh.location === 'CAM_2') {
      threats.push({
        name: 'AADESH',
        photo: './assets/images/aadesh-frontfacing-cutout.png',
        pose: 'Advancing Down Main Corridor',
        posClass: 'bottom-10 left-[35%] w-52 md:w-64'
      });
    } else if (gameState.currentCam === 'CAM_1' && gameState.aadesh.location === 'CAM_1') {
      threats.push({
        name: 'AADESH',
        photo: './assets/images/aadesh-frontfacing-cutout.png',
        pose: 'Roaming Physics Lab',
        posClass: 'bottom-12 right-[32%] w-48 md:w-60'
      });
    }

    // DIPU: clean transparent cutouts for all stages
    if (gameState.currentCam === 'CAM_3') {
      if (gameState.dipu.stage === 0) {
        threats.push({
          name: 'DIPU',
          photo: './assets/images/dipu-frontfacing-cutout.png',
          pose: 'Resting in Supply Hall',
          posClass: 'bottom-10 left-[26%] w-48 md:w-60'
        });
      } else if (gameState.dipu.stage === 1) {
        threats.push({
          name: 'DIPU',
          photo: './assets/images/dipu-random-cutout.png',
          pose: 'ALERT! Creeping Closer!',
          posClass: 'bottom-8 left-[30%] w-56 md:w-72'
        });
      }
    } else if (gameState.currentCam === 'CAM_2' && gameState.dipu.stage === 2) {
      threats.push({
        name: 'DIPU',
        photo: './assets/images/dipu-jumpscare-cutout.png',
        pose: 'SPRINTING DOWN CORRIDOR!',
        posClass: 'bottom-10 left-1/2 -translate-x-1/2 w-64 md:w-80'
      });
    }

    // AB: uses transparent full-body and face cutouts
    if (gameState.currentCam === 'CAM_1' && gameState.ab.location === 'CAM_1') {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-cutout.png',
        pose: 'Lurking in Physics Lab',
        posClass: 'bottom-10 right-[25%] w-48 md:w-64'
      });
    } else if (gameState.currentCam === 'CAM_2' && gameState.ab.location === 'CAM_2') {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-random-cutout.png',
        pose: 'Roaming Main Corridor',
        posClass: 'bottom-12 left-1/2 -translate-x-1/2 w-52 md:w-68'
      });
    } else if (gameState.currentCam === 'CAM_4' && gameState.ab.location === 'CAM_4') {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-cutout.png',
        pose: 'Stalking Central Stairs',
        posClass: 'bottom-12 right-[28%] w-48 md:w-64'
      });
    }

    return threats;
  };

  const activeThreats = getActiveRoomThreats();

  // Blueprint Map Nodes with connection metadata
  const mapNodes = [
    { id: 'CAM_1', name: 'Physics Lab', cx: 160, cy: 38, w: 90, h: 32 },
    { id: 'CAM_2', name: 'Main Corridor', cx: 160, cy: 110, w: 96, h: 32 },
    { id: 'CAM_3', name: 'Supply Hall', cx: 48, cy: 110, w: 80, h: 32 },
    { id: 'CAM_4', name: 'Stairs', cx: 272, cy: 110, w: 80, h: 32 },
    { id: 'CAM_5', name: 'Office Door', cx: 160, cy: 178, w: 90, h: 30 },
  ];

  return (
    <div className="fixed inset-0 z-45 bg-black flex flex-col justify-between overflow-hidden monitor-flip-up select-none">
      {/* CCTV Viewport Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-neutral-950 flex items-center justify-center">
        {/* Actual Static Room Camera Image */}
        <img
          src={activeCam.image}
          alt={activeCam.name}
          className="w-full h-full object-cover filter brightness-[0.78] contrast-125"
        />

        {/* PERSISTENT THREAT RENDERING: Cutout Persons Rendered Seamlessly inside the Room */}
        {activeThreats.map((threat, idx) => (
          <div
            key={idx}
            className={`absolute ${threat.posClass} z-20 flex flex-col items-center pointer-events-none animate-pulse`}
          >
            {/* Transparent Cutout Person (Background Removed) */}
            <div className="relative flex flex-col items-center">
              <img
                src={threat.photo}
                alt={threat.name}
                className="max-h-60 sm:max-h-72 md:max-h-96 w-auto object-contain filter contrast-125 saturate-125 drop-shadow-[0_0_25px_rgba(255,0,0,0.8)]"
              />
              {/* Surveillance Subject Tag */}
              <div className="bg-red-700/90 text-white font-mono text-[9px] md:text-xs font-bold px-2 py-0.5 rounded border border-red-400 mt-1 uppercase tracking-wider shadow">
                ● {threat.name} — {threat.pose}
              </div>
            </div>
          </div>
        ))}

        {/* Dipu Missing Alarm on CAM 3 */}
        {gameState.currentCam === 'CAM_3' && gameState.dipu.stage === 2 && (
          <div className="absolute inset-x-0 top-1/3 z-25 text-center pointer-events-none animate-bounce px-4">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-red-950/95 border-2 border-red-500 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-red-400 font-bold text-xs sm:text-base md:text-lg font-mono shadow-[0_0_30px_rgba(239,68,68,0.9)]">
              <AlertTriangle size={24} className="text-red-500 shrink-0" />
              <span>WARNING: DIPU ESCAPED CAM 3! SPRINT IN PROGRESS!</span>
            </div>
          </div>
        )}

        {/* Switching Noise / Static Burst */}
        {switchingStatic && (
          <div className="absolute inset-0 bg-neutral-900 static-fuzz opacity-95 z-30" />
        )}

        {/* Surveillance Grid & CRT Scanline Overlays */}
        <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none mix-blend-color" />
        <div className="absolute inset-0 static-fuzz opacity-15 pointer-events-none" />
        <div className="crt-overlay" />
        <div className="crt-vignette" />

        {/* Top Header Bar - Responsive for Mobile & Desktop */}
        <div className="absolute top-2 sm:top-5 inset-x-2 sm:inset-x-6 z-40 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-1.5 sm:gap-3 bg-black/85 backdrop-blur px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg border border-neutral-700 shadow-xl">
            <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-red-600 animate-ping" />
            <span className="font-mono text-xs sm:text-base font-bold text-red-500 tracking-wider">● REC</span>
            <span className="text-gray-200 font-mono text-[10px] sm:text-sm font-semibold truncate max-w-[140px] sm:max-w-none">
              {activeCam.id}: {activeCam.name}
            </span>
          </div>

          <div className="bg-black/85 backdrop-blur px-2.5 py-1 sm:px-4 sm:py-2 rounded-lg border border-neutral-700 shadow-xl text-right font-mono">
            <div className="text-sm sm:text-xl font-bold text-white">
              {gameState.time === 0 ? '12' : gameState.time} AM
            </div>
            <div className="text-[9px] sm:text-xs text-red-400 font-bold">NIGHT {gameState.night}</div>
          </div>
        </div>

        {/* VISUAL ARCHITECTURAL BLUEPRINT MAP OF CONNECTED PLACES - Responsive for Mobile */}
        <div className="absolute bottom-16 sm:bottom-20 right-3 sm:right-6 z-40 bg-neutral-950/95 backdrop-blur-md border-2 border-emerald-500/80 p-2 sm:p-3.5 rounded-xl shadow-2xl pointer-events-auto w-[calc(100vw-24px)] max-w-[320px] sm:max-w-[340px]">
          <div className="text-[10px] sm:text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider mb-1.5 flex items-center justify-between border-b border-emerald-900/60 pb-1">
            <div className="flex items-center gap-1.5">
              <Camera size={13} />
              <span>FACILITY BLUEPRINT</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-emerald-500 animate-pulse font-bold">LIVE MAP</span>
          </div>

          {/* SVG Map Showing How Places Physically Connect to Each Other */}
          <div className="relative w-full h-[155px] sm:h-[195px] bg-black/80 rounded-lg border border-emerald-950 p-1 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 320 220" className="w-full h-full">
              {/* Hallway connection corridors */}
              <line x1="160" y1="54" x2="160" y2="94" stroke="#064e3b" strokeWidth="8" strokeLinecap="round" />
              <line x1="160" y1="54" x2="160" y2="94" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

              <line x1="112" y1="110" x2="88" y2="110" stroke="#064e3b" strokeWidth="8" strokeLinecap="round" />
              <line x1="112" y1="110" x2="88" y2="110" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

              <line x1="208" y1="110" x2="232" y2="110" stroke="#064e3b" strokeWidth="8" strokeLinecap="round" />
              <line x1="208" y1="110" x2="232" y2="110" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

              <line x1="160" y1="126" x2="160" y2="163" stroke="#064e3b" strokeWidth="8" strokeLinecap="round" />
              <line x1="160" y1="126" x2="160" y2="163" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

              <line x1="160" y1="193" x2="160" y2="210" stroke="#047857" strokeWidth="6" strokeDasharray="2 2" />

              {/* Interactive Room Nodes */}
              {mapNodes.map((node) => {
                const isSelected = node.id === gameState.currentCam;
                const rx = node.cx - node.w / 2;
                const ry = node.cy - node.h / 2;

                return (
                  <g 
                    key={node.id} 
                    onClick={() => handleCameraChange(node.id)}
                    className="cursor-pointer group"
                  >
                    {isSelected && (
                      <rect
                        x={rx - 3}
                        y={ry - 3}
                        width={node.w + 6}
                        height={node.h + 6}
                        rx="6"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}
                    <rect
                      x={rx}
                      y={ry}
                      width={node.w}
                      height={node.h}
                      rx="4"
                      fill={isSelected ? '#064e3b' : '#171717'}
                      stroke={isSelected ? '#10b981' : '#525252'}
                      strokeWidth={isSelected ? '2' : '1'}
                      className="transition group-hover:fill-neutral-800"
                    />
                    <text
                      x={node.cx}
                      y={node.cy - 2}
                      textAnchor="middle"
                      fill={isSelected ? '#a7f3d0' : '#e5e5e5'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.id}
                    </text>
                    <text
                      x={node.cx}
                      y={node.cy + 9}
                      textAnchor="middle"
                      fill={isSelected ? '#6ee7b7' : '#9ca3af'}
                      fontSize="7.5"
                      fontFamily="monospace"
                    >
                      {node.name}
                    </text>
                  </g>
                );
              })}

              {/* You are Here tag */}
              <g transform="translate(160, 212)">
                <rect x="-35" y="-7" width="70" height="15" rx="3" fill="#047857" />
                <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace">
                  YOU (OFFICE)
                </text>
              </g>
            </svg>
          </div>

          {/* Quick-Switch Mobile Camera Buttons Strip */}
          <div className="grid grid-cols-5 gap-1 pt-1.5 border-t border-emerald-900/50 mt-1.5">
            {CAMERAS.map((cam) => {
              const isSelected = cam.id === gameState.currentCam;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraChange(cam.id)}
                  className={`py-1 rounded font-mono text-[9px] font-bold transition active:scale-95 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-[0_0_8px_#10b981]'
                      : 'bg-black/70 text-gray-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {cam.id.replace('_', ' ')}
                </button>
              );
            })}
          </div>

          <div className="mt-1 text-[8px] sm:text-[9px] font-mono text-gray-400 flex justify-between items-center px-1">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>ACTIVE: {activeCam.id}</span>
            </span>
            <span className={gameState.power > 20 ? 'text-emerald-400 font-bold' : 'text-red-500 font-bold'}>
              BATTERY: {Math.round(gameState.power)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Big Clickable Close Monitor Trigger - Easy to tap with thumbs */}
      <div className="relative z-45 flex justify-center pb-2 sm:pb-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-2 px-3 pointer-events-auto">
        <button
          onClick={onToggleMonitor}
          className="group w-full max-w-xs sm:max-w-md py-2.5 sm:py-3 bg-neutral-900/95 hover:bg-neutral-800 border-2 border-neutral-500 hover:border-red-500 rounded-t-xl transition-all duration-150 flex items-center justify-center gap-2 sm:gap-3 shadow-2xl cursor-pointer active:scale-95"
          title="Close CCTV Monitor [SPACE]"
        >
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-600 group-hover:animate-ping" />
          <span className="text-xs sm:text-sm font-bold tracking-wider sm:tracking-widest text-gray-100 group-hover:text-white uppercase font-mono">
            ▼ CLOSE SURVEILLANCE CAMERAS <span className="hidden sm:inline">[SPACE]</span>
          </span>
        </button>
      </div>
    </div>
  );
}
