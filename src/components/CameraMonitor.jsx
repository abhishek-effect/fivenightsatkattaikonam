import React, { useState } from 'react';
import { Camera, AlertTriangle, X, Radio, Eye } from 'lucide-react';
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

  // Determine which animatronics are in the active room and which photo to show
  const getActiveRoomThreats = () => {
    const threats = [];

    // AADESH: uses different photos based on location!
    if (gameState.currentCam === 'CAM_4' && gameState.aadesh.location === 'CAM_4') {
      threats.push({
        name: 'AADESH',
        photo: './assets/images/aadesh-sideways.jpg',
        pose: 'Sneaking by Stairs',
        posClass: 'bottom-12 left-1/4 w-48 md:w-60'
      });
    } else if (gameState.currentCam === 'CAM_2' && gameState.aadesh.location === 'CAM_2') {
      threats.push({
        name: 'AADESH',
        photo: './assets/images/aadesh-frontfacing.jpg',
        pose: 'Approaching Hallway',
        posClass: 'bottom-16 left-1/3 w-52 md:w-64'
      });
    } else if (gameState.currentCam === 'CAM_1' && gameState.aadesh.location === 'CAM_1') {
      threats.push({
        name: 'AADESH',
        photo: './assets/images/aadesh-frontfacing.jpg',
        pose: 'In Lab',
        posClass: 'bottom-20 right-1/3 w-48 md:w-60'
      });
    }

    // DIPU: stages in CAM 3 and sprint in CAM 2
    if (gameState.currentCam === 'CAM_3') {
      if (gameState.dipu.stage === 0) {
        threats.push({
          name: 'DIPU',
          photo: './assets/images/dipu-frontfacing.jpg',
          pose: 'Resting by Shelf',
          posClass: 'bottom-16 left-1/4 w-52 md:w-64'
        });
      } else if (gameState.dipu.stage === 1) {
        threats.push({
          name: 'DIPU',
          photo: './assets/images/dipu-random.jpg',
          pose: 'Active & Creeping Closer!',
          posClass: 'bottom-12 left-1/3 w-60 md:w-72'
        });
      }
    } else if (gameState.currentCam === 'CAM_2' && gameState.dipu.stage === 2) {
      threats.push({
        name: 'DIPU',
        photo: './assets/images/dipu-jumpscare.png',
        pose: 'CHARGING DOWN CORRIDOR!',
        posClass: 'bottom-16 left-1/2 -translate-x-1/2 w-64 md:w-80'
      });
    }

    // AB: uses ab-cutout and ab-random
    if (gameState.currentCam === 'CAM_1' && gameState.ab.location === 'CAM_1') {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-cutout.png',
        pose: 'Lurking in Lab',
        posClass: 'bottom-12 right-1/4 w-48 md:w-60'
      });
    } else if (gameState.currentCam === 'CAM_2' && gameState.ab.location === 'CAM_2') {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-random.jpg',
        pose: 'Roaming Main Hallway',
        posClass: 'bottom-20 left-1/2 -translate-x-1/2 w-52 md:w-64'
      });
    } else if (gameState.currentCam === 'CAM_4' && gameState.ab.location === 'CAM_4') {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-cutout.png',
        pose: 'Ascending Stairs',
        posClass: 'bottom-16 right-1/3 w-48 md:w-60'
      });
    } else if (gameState.currentCam === 'CAM_5' && gameState.ab.location === 'DOOR') {
      threats.push({
        name: 'AB',
        photo: './assets/images/ab-cutout.png',
        pose: 'OUTSIDE YOUR DOOR!',
        posClass: 'bottom-10 left-1/2 -translate-x-1/2 w-64 md:w-80'
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

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* CCTV Camera Video Feed Viewport */}
      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {/* The Actual Camera Feed Image of the Room */}
        <img
          key={activeCam.id}
          src={getCameraImage()}
          alt={activeCam.name}
          className="w-full h-full object-cover filter brightness-90 contrast-110"
        />

        {/* Dynamic Animatronic Character Presence In the Room */}
        {currentThreats.map((threat, idx) => (
          <div 
            key={`${threat.name}-${idx}`} 
            className={`absolute ${threat.posClass} z-20 flex flex-col items-center pointer-events-none animate-pulse`}
          >
            {/* Live Camera Targeting Box */}
            <div className="border-2 border-red-500/90 rounded bg-black/40 backdrop-blur-[2px] p-1.5 shadow-[0_0_20px_rgba(239,68,68,0.7)] flex flex-col items-center">
              <img
                src={threat.photo}
                alt={threat.name}
                className="max-h-72 md:max-h-96 w-auto object-contain filter contrast-125 saturate-125"
              />
              <div className="bg-red-700 text-white font-mono text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-sm mt-1 uppercase tracking-wider">
                ● {threat.name} - {threat.pose}
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
          {/* Active Camera Status */}
          <div className="flex items-center gap-3 bg-black/85 backdrop-blur px-4 py-2 rounded-lg border border-neutral-700 shadow-xl">
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping" />
            <span className="font-mono text-base font-bold text-red-500 tracking-wider">● REC</span>
            <span className="text-gray-200 font-mono text-sm font-semibold">
              {activeCam.id}: {activeCam.name} ({activeCam.sub})
            </span>
          </div>

          {/* Time & Night HUD */}
          <div className="bg-black/85 backdrop-blur px-4 py-2 rounded-lg border border-neutral-700 shadow-xl text-right font-mono">
            <div className="text-xl font-bold text-white">
              {gameState.time === 0 ? '12' : gameState.time} AM
            </div>
            <div className="text-xs text-red-400 font-bold">NIGHT {gameState.night}</div>
          </div>
        </div>

        {/* Interactive Camera Switching Mini-Map (Bottom Right) */}
        <div className="absolute bottom-20 right-6 z-40 bg-neutral-950/95 backdrop-blur-md border-2 border-neutral-600 p-4 rounded-xl shadow-2xl pointer-events-auto max-w-xs w-full">
          <div className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider mb-3 flex items-center justify-between border-b border-neutral-800 pb-1.5">
            <div className="flex items-center gap-1.5">
              <Camera size={16} />
              <span>CCTV SURVEILLANCE MAP</span>
            </div>
            <span className="text-[10px] text-gray-400">SELECT CAM</span>
          </div>

          {/* Camera Buttons Grid */}
          <div className="flex flex-col gap-2 font-mono">
            {CAMERAS.map((cam) => {
              const isSelected = cam.id === gameState.currentCam;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraChange(cam.id)}
                  className={`px-3 py-2 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-900/90 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.6)] ring-1 ring-emerald-400'
                      : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-gray-400'}`}>
                      {cam.id}
                    </span>
                    <span className="text-xs font-semibold">{cam.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{cam.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Battery Status */}
          <div className="mt-3 pt-2 border-t border-neutral-800 text-[11px] font-mono flex justify-between items-center text-gray-400">
            <span>OFFICE: [SAFE]</span>
            <span className={gameState.power > 20 ? 'text-emerald-400 font-bold' : 'text-red-500 font-bold animate-pulse'}>
              PWR: {Math.round(gameState.power)}%
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
