import React, { useState, useEffect } from 'react';
import { Camera, Radio, AlertTriangle } from 'lucide-react';
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
    }, 120);
  };

  // Animatronic presence checks on active camera
  const isABHere = (
    (gameState.currentCam === 'CAM_1' && gameState.ab.location === 'CAM_1') ||
    (gameState.currentCam === 'CAM_2' && gameState.ab.location === 'CAM_2') ||
    (gameState.currentCam === 'CAM_4' && gameState.ab.location === 'CAM_4')
  );

  const isDipuHere = (
    (gameState.currentCam === 'CAM_3' && gameState.dipu.stage < 2) ||
    (gameState.currentCam === 'CAM_2' && gameState.dipu.stage === 2)
  );

  const isAadeshHere = (
    (gameState.currentCam === 'CAM_4' && gameState.aadesh.location === 'CAM_4') ||
    (gameState.currentCam === 'CAM_2' && gameState.aadesh.location === 'CAM_2')
  );

  return (
    <div className="absolute inset-0 z-35 bg-black flex flex-col justify-between overflow-hidden monitor-flip-up select-none">
      {/* Active Camera View Feed */}
      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {/* Main Room Camera Image */}
        <img
          src={
            activeCam.id === 'CAM_5' 
              ? (gameState.isDoorClosed ? './assets/images/office-door-closed.jpg' : './assets/images/office-door-open.jpg')
              : activeCam.image
          }
          alt={activeCam.name}
          className="w-full h-full object-cover filter brightness-75 contrast-125 saturate-50"
        />

        {/* Dynamic Animatronic Compositing in CCTV Feeds */}
        {/* AB in Room A (CAM 1) */}
        {gameState.currentCam === 'CAM_1' && gameState.ab.location === 'CAM_1' && (
          <div className="absolute bottom-16 right-1/4 w-44 md:w-56 pointer-events-none animate-pulse">
            <img 
              src="./assets/images/ab-cutout.png" 
              alt="AB lurking" 
              className="w-full filter brightness-75 contrast-125 drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]" 
            />
          </div>
        )}

        {/* AB in Corridor A (CAM 2) */}
        {gameState.currentCam === 'CAM_2' && gameState.ab.location === 'CAM_2' && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 md:w-64 pointer-events-none animate-pulse">
            <img 
              src="./assets/images/ab-cutout.png" 
              alt="AB in corridor" 
              className="w-full filter brightness-50 contrast-150 drop-shadow-[0_0_20px_rgba(0,0,0,1)]" 
            />
          </div>
        )}

        {/* Dipu in Corridor B (CAM 3) */}
        {gameState.currentCam === 'CAM_3' && (
          <>
            {gameState.dipu.stage === 0 && (
              <div className="absolute bottom-28 left-1/3 w-32 opacity-70 pointer-events-none">
                <img 
                  src="./assets/images/dipu-jumpscare.png" 
                  alt="Dipu peeking" 
                  className="w-full object-cover rounded-full filter brightness-50 scale-75" 
                />
              </div>
            )}
            {gameState.dipu.stage === 1 && (
              <div className="absolute bottom-20 left-1/4 w-52 pointer-events-none animate-pulse">
                <img 
                  src="./assets/images/dipu-jumpscare.png" 
                  alt="Dipu ready to sprint" 
                  className="w-full rounded filter brightness-85 contrast-125 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]" 
                />
              </div>
            )}
            {gameState.dipu.stage === 2 && (
              <div className="absolute inset-x-0 top-1/3 text-center pointer-events-none animate-pulse">
                <div className="inline-flex items-center gap-2 bg-red-950/90 border-2 border-red-500 px-6 py-3 rounded text-red-400 font-bold text-lg font-mono">
                  <AlertTriangle size={24} className="text-red-500 animate-bounce" />
                  WARNING: SUBJECT MISSING FROM CAM 3! SPRINT IN PROGRESS!
                </div>
              </div>
            )}
          </>
        )}

        {/* Dipu sprinting through Corridor A (CAM 2) */}
        {gameState.currentCam === 'CAM_2' && gameState.dipu.stage === 2 && (
          <div className="absolute bottom-16 left-1/3 w-64 pointer-events-none animate-bounce">
            <img 
              src="./assets/images/dipu-jumpscare.png" 
              alt="Dipu sprinting" 
              className="w-full filter brightness-90 contrast-150 drop-shadow-[0_0_25px_rgba(255,0,0,1)]" 
            />
          </div>
        )}

        {/* Aadesh on Stairs (CAM 4) */}
        {gameState.currentCam === 'CAM_4' && gameState.aadesh.location === 'CAM_4' && (
          <div className="absolute top-1/4 left-1/4 w-40 md:w-52 pointer-events-none animate-pulse">
            <img 
              src="./assets/images/aadesh-jumpscare.jpg" 
              alt="Aadesh on stairs" 
              className="w-full object-contain filter brightness-60 contrast-125 rounded drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]" 
            />
          </div>
        )}

        {/* Switching Noise Burst / Static */}
        {switchingStatic && (
          <div className="absolute inset-0 bg-neutral-900 static-fuzz opacity-90 z-20" />
        )}

        {/* CCTV Greenish / Grain Video Filter */}
        <div className="absolute inset-0 bg-emerald-950/15 pointer-events-none mix-blend-color" />
        <div className="absolute inset-0 static-fuzz opacity-35 pointer-events-none" />
        <div className="crt-overlay" />
        <div className="crt-vignette" />

        {/* Top Bar HUD */}
        <div className="absolute top-6 inset-x-8 z-30 flex justify-between items-start pointer-events-none">
          <div className="flex items-center gap-3 bg-black/75 px-4 py-2 rounded border border-neutral-700">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
            <span className="font-mono text-base font-bold text-red-500 tracking-wider">● REC</span>
            <span className="text-gray-400 font-mono text-sm">CAM: {activeCam.name} ({activeCam.sub})</span>
          </div>

          <div className="bg-black/75 px-4 py-2 rounded border border-neutral-700 text-right">
            <div className="text-xl font-bold font-mono text-white">
              {gameState.time === 0 ? '12' : gameState.time} AM
            </div>
            <div className="text-xs text-red-400 font-mono">NIGHT {gameState.night}</div>
          </div>
        </div>

        {/* Mini Floor Plan Surveillance Map (Bottom Right) */}
        <div className="absolute bottom-16 right-8 z-30 bg-black/85 backdrop-blur border-2 border-neutral-700 p-4 rounded-lg shadow-2xl pointer-events-auto">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b border-neutral-800 pb-1">
            <Camera size={14} className="text-emerald-400" />
            <span>CAMPUS LAYOUT CCTV MAP</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {CAMERAS.map((cam) => {
              const isSelected = cam.id === gameState.currentCam;
              return (
                <button
                  key={cam.id}
                  onClick={() => handleCameraChange(cam.id)}
                  className={`px-3 py-2 rounded border text-left flex flex-col transition ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                      : 'bg-neutral-900 border-neutral-700 text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <span className="font-bold text-[11px]">{cam.id}</span>
                  <span className="text-[10px] text-gray-400 truncate">{cam.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-neutral-800 text-[10px] text-neutral-400 flex justify-between">
            <span>YOU: [OFFICE]</span>
            <span className={gameState.power > 20 ? 'text-emerald-400' : 'text-red-500'}>
              PWR: {Math.round(gameState.power)}%
            </span>
          </div>
        </div>
      </div>

      {/* Flip Down Trigger Bar */}
      <div className="relative z-35 flex justify-center pb-2 bg-gradient-to-t from-black via-black/80 to-transparent pt-4">
        <button
          onClick={onToggleMonitor}
          className="group px-12 py-3 bg-neutral-900/90 hover:bg-neutral-800 border-2 border-neutral-600 hover:border-red-500 rounded-t-xl transition-all duration-150 flex items-center gap-3 shadow-2xl"
          title="Press SPACE to Close Monitor"
        >
          <div className="w-3 h-3 rounded-full bg-red-600 group-hover:animate-ping" />
          <span className="text-sm font-bold tracking-widest text-gray-200 group-hover:text-white uppercase font-mono">
            ▼ CLOSE SURVEILLANCE [SPACE]
          </span>
        </button>
      </div>
    </div>
  );
}
