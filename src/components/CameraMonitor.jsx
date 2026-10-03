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
    } else if (gameState.currentCam === 'CAM_5' && gameState.ab.location === 'DOOR') {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-cutout.png',
        pose: 'OUTSIDE YOUR DOOR!',
        posClass: 'bottom-8 left-1/2 -translate-x-1/2 w-64 md:w-80'
      });
    }

    return threats;
  };

  const currentThreats = getActiveRoomThreats();

  // Get active room camera image
  const getCameraImage = () => {
    if (activeCam.id === 'CAM_5') {
      return gameState.isDoorClosed
        ? './assets/images/office-door-closed.jpg'
        : './assets/images/office-door-open.jpg';
    }
    return activeCam.image;
  };

  // Blueprint layout nodes for visual facility blueprint
  const mapNodes = [
    { id: 'CAM_1', name: 'Physics Lab', sub: 'Room A', cx: 160, cy: 38, w: 90, h: 32 },
    { id: 'CAM_2', name: 'Main Corridor', sub: 'Corridor A', cx: 160, cy: 110, w: 96, h: 32 },
    { id: 'CAM_3', name: 'Supply Hall', sub: 'Corridor B', cx: 50, cy: 110, w: 76, h: 32 },
    { id: 'CAM_4', name: 'Stairs', sub: 'Staircase', cx: 270, cy: 110, w: 76, h: 32 },
    { id: 'CAM_5', name: 'Doorway', sub: 'Entrance', cx: 160, cy: 178, w: 84, h: 30 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* CCTV Camera Video Feed Viewport */}
      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {/* The Actual Camera Feed Image of the Room */}
        <img
          key={activeCam.id}
          src={getCameraImage()}
          alt={activeCam.name}
          className="w-full h-full object-cover filter brightness-95 contrast-110"
        />

        {/* Dynamic Transparent Animatronic Cutouts Standing In the Room */}
        {currentThreats.map((threat, idx) => (
          <div 
            key={`${threat.name}-${idx}`} 
            className={`absolute ${threat.posClass} z-20 flex flex-col items-center pointer-events-none animate-pulse`}
          >
            {/* Transparent Cutout Person (Background Removed) */}
            <div className="relative flex flex-col items-center">
              <img
                src={threat.photo}
                alt={threat.name}
                className="max-h-72 md:max-h-96 w-auto object-contain filter contrast-125 saturate-125 drop-shadow-[0_0_25px_rgba(255,0,0,0.8)]"
              />
              {/* Surveillance Subject Tag */}
              <div className="bg-red-700/90 text-white font-mono text-[10px] md:text-xs font-bold px-2 py-0.5 rounded border border-red-400 mt-1 uppercase tracking-wider shadow">
                ● {threat.name} — {threat.pose}
              </div>
            </div>
          </div>
        ))}

        {/* Dipu Missing Alarm on CAM 3 */}
        {gameState.currentCam === 'CAM_3' && gameState.dipu.stage === 2 && (
          <div className="absolute inset-x-0 top-1/3 z-25 text-center pointer-events-none animate-bounce">
            <div className="inline-flex items-center gap-3 bg-red-950/95 border-2 border-red-500 px-6 py-3 rounded-lg text-red-400 font-bold text-base md:text-lg font-mono shadow-[0_0_30px_rgba(239,68,68,0.9)]">
              <AlertTriangle size={28} className="text-red-500" />
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

        {/* Top Header Bar */}
        <div className="absolute top-5 inset-x-6 z-40 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-3 bg-black/85 backdrop-blur px-4 py-2 rounded-lg border border-neutral-700 shadow-xl">
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping" />
            <span className="font-mono text-base font-bold text-red-500 tracking-wider">● REC</span>
            <span className="text-gray-200 font-mono text-sm font-semibold">
              {activeCam.id}: {activeCam.name} ({activeCam.sub})
            </span>
          </div>

          <div className="bg-black/85 backdrop-blur px-4 py-2 rounded-lg border border-neutral-700 shadow-xl text-right font-mono">
            <div className="text-xl font-bold text-white">
              {gameState.time === 0 ? '12' : gameState.time} AM
            </div>
            <div className="text-xs text-red-400 font-bold">NIGHT {gameState.night}</div>
          </div>
        </div>

        {/* VISUAL ARCHITECTURAL BLUEPRINT MAP OF CONNECTED PLACES (Bottom Right) */}
        <div className="absolute bottom-20 right-6 z-40 bg-neutral-950/95 backdrop-blur-md border-2 border-emerald-500/80 p-4 rounded-xl shadow-2xl pointer-events-auto w-[330px]">
          <div className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider mb-2 flex items-center justify-between border-b border-emerald-900/60 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Camera size={15} />
              <span>FACILITY BLUEPRINT & CONNECTIONS</span>
            </div>
            <span className="text-[10px] text-emerald-500 animate-pulse font-bold">LIVE MAP</span>
          </div>

          {/* SVG Map Showing How Places Physically Connect to Each Other */}
          <div className="relative w-full h-[230px] bg-black/80 rounded-lg border border-emerald-950 p-1 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 320 230" className="w-full h-full">
              {/* Hallway connection corridors */}
              {/* CAM 1 (Physics Lab) -> CAM 2 (Main Corridor) */}
              <line x1="160" y1="54" x2="160" y2="94" stroke="#064e3b" strokeWidth="8" strokeLinecap="round" />
              <line x1="160" y1="54" x2="160" y2="94" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

              {/* CAM 2 (Main Corridor) -> CAM 3 (Supply Hallway) */}
              <line x1="112" y1="110" x2="88" y2="110" stroke="#064e3b" strokeWidth="8" strokeLinecap="round" />
              <line x1="112" y1="110" x2="88" y2="110" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

              {/* CAM 2 (Main Corridor) -> CAM 4 (Stairs) */}
              <line x1="208" y1="110" x2="232" y2="110" stroke="#064e3b" strokeWidth="8" strokeLinecap="round" />
              <line x1="208" y1="110" x2="232" y2="110" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

              {/* CAM 2 (Main Corridor) -> CAM 5 (Office Doorway) */}
              <line x1="160" y1="126" x2="160" y2="163" stroke="#064e3b" strokeWidth="8" strokeLinecap="round" />
              <line x1="160" y1="126" x2="160" y2="163" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />

              {/* CAM 5 (Doorway) -> YOU (Office) */}
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
                    {/* Glowing selection aura */}
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
                    {/* Room Box */}
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
                    {/* Camera ID */}
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
                    {/* Room Name */}
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

              {/* YOU (Security Office) Room Node at the very bottom */}
              <rect
                x="115"
                y="208"
                width="90"
                height="18"
                rx="4"
                fill="#1e1b4b"
                stroke="#6366f1"
                strokeWidth="1.5"
              />
              <text
                x="160"
                y="220"
                textAnchor="middle"
                fill="#c7d2fe"
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                ● YOU: OFFICE
              </text>
            </svg>
          </div>

          {/* Spatial corridor legend */}
          <div className="mt-2 text-[9px] font-mono text-gray-400 flex justify-between items-center px-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
              <span>ACTIVE: {activeCam.id}</span>
            </span>
            <span className={gameState.power > 20 ? 'text-emerald-400 font-bold' : 'text-red-500 font-bold'}>
              BATTERY: {Math.round(gameState.power)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Big Clickable Close Monitor Trigger */}
      <div className="relative z-45 flex justify-center pb-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-4 pointer-events-auto">
        <button
          onClick={onToggleMonitor}
          className="group px-14 py-3 bg-neutral-900/95 hover:bg-neutral-800 border-2 border-neutral-500 hover:border-red-500 rounded-t-xl transition-all duration-150 flex items-center gap-3 shadow-2xl cursor-pointer"
          title="Press SPACE or Click to Close CCTV Monitor"
        >
          <div className="w-3 h-3 rounded-full bg-red-600 group-hover:animate-ping" />
          <span className="text-sm font-bold tracking-widest text-gray-100 group-hover:text-white uppercase font-mono">
            ▼ CLOSE SURVEILLANCE CAMERAS [SPACE]
          </span>
        </button>
      </div>
    </div>
  );
}
