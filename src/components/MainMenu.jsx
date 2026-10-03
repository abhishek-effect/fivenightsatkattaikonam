import React, { useState } from 'react';
import { Volume2, VolumeX, Play, ShieldAlert, Settings, HelpCircle } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';
import { NIGHT_PRESETS } from '../game/gameEngine';

export default function MainMenu({ onStartGame, currentNight, onSelectNight }) {
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [showLore, setShowLore] = useState(false);
  const [showCustomNight, setShowCustomNight] = useState(false);
  const [customAI, setCustomAI] = useState({ ab: 10, dipu: 10, aadesh: 10 });

  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleCustomStart = () => {
    onStartGame(6, {
      abLevel: customAI.ab,
      dipuLevel: customAI.dipu,
      aadeshLevel: customAI.aadesh,
      hourSeconds: 50,
      label: 'Night 6 - Custom Night'
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex flex-col justify-between p-8 select-none">
      {/* Background menu image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-80 filter contrast-125"
        style={{ backgroundImage: `url('./assets/images/menu-bg.png')` }}
      />

      {/* CRT Scanline & static overlay */}
      <div className="crt-overlay" />
      <div className="crt-vignette" />
      <div className="absolute inset-0 static-fuzz pointer-events-none" />

      {/* Header controls */}
      <div className="relative z-10 flex justify-between items-center">
        <div className="flex items-center space-x-2 bg-black/60 backdrop-blur border border-red-500/40 px-3 py-1.5 rounded">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600 animate-ping mr-2" />
          <span className="text-red-500 font-bold tracking-widest text-sm uppercase">CCTV SURVEILLANCE SYSTEM v1.987</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded bg-black/70 hover:bg-red-950/80 border border-gray-700 hover:border-red-500 transition text-gray-300 hover:text-white flex items-center gap-2 text-sm"
            title="Toggle Mute"
          >
            {isMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-green-400" />}
            <span>{isMuted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>

          <button
            onClick={() => setShowLore(true)}
            className="p-2.5 rounded bg-black/70 hover:bg-neutral-800 border border-gray-700 hover:border-gray-400 transition text-gray-300 flex items-center gap-1.5 text-sm"
          >
            <HelpCircle size={18} />
            <span>HOW TO PLAY</span>
          </button>
        </div>
      </div>

      {/* Center Left Title & Main Navigation */}
      <div className="relative z-10 max-w-md my-auto space-y-6 bg-black/60 p-6 rounded-lg border border-neutral-800 backdrop-blur-sm">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-wider text-red-600 glitch-text drop-shadow-[0_2px_10px_rgba(255,0,0,0.8)]">
            FIVE NIGHTS
          </h1>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-widest text-gray-200">
            AT KATTAIKONAM
          </h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
            Survive the Night Shift from 12 AM to 6 AM
          </p>
        </div>

        {/* Menu Actions */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => onStartGame(currentNight)}
            className="w-full py-3.5 px-6 bg-red-900/40 hover:bg-red-700/60 border-2 border-red-600 hover:border-red-400 text-white font-bold tracking-widest text-lg rounded transition-all duration-200 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] group"
          >
            <Play size={20} className="text-red-400 group-hover:scale-125 transition-transform" />
            <span>CONTINUE (NIGHT {currentNight})</span>
          </button>

          <button
            onClick={() => onStartGame(1)}
            className="w-full py-2.5 px-6 bg-black/80 hover:bg-neutral-800 border border-gray-700 hover:border-gray-400 text-gray-200 font-semibold tracking-wider text-sm rounded transition"
          >
            NEW GAME (NIGHT 1)
          </button>

          {/* Night Selector Grid */}
          <div className="pt-2">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Select Night:</div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => {
                    onSelectNight(n);
                    onStartGame(n);
                  }}
                  className={`py-2 text-xs font-bold rounded border transition ${
                    n === currentNight
                      ? 'bg-red-600/30 border-red-500 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                      : 'bg-black/50 border-neutral-700 hover:border-neutral-400 text-gray-400 hover:text-white'
                  }`}
                >
                  NIGHT {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowCustomNight(true)}
            className="w-full py-2 px-4 bg-neutral-900 hover:bg-neutral-800 border border-yellow-600/50 hover:border-yellow-500 text-yellow-400 font-mono text-xs rounded transition flex items-center justify-center gap-2"
          >
            <Settings size={14} />
            <span>CUSTOM NIGHT (AI CONFIG)</span>
          </button>
        </div>
      </div>

      {/* Footer controls & credits */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 bg-black/60 backdrop-blur border-t border-neutral-900 pt-3">
        <div className="flex gap-4 items-center">
          <span>CONTROLS: [SPACE] Monitor</span>
          <span>•</span>
          <span>[D] Door Lock</span>
          <span>•</span>
          <span>[L] Hallway Light</span>
        </div>
        <div className="text-gray-400 mt-2 md:mt-0">
          Kattaikonam Campus Security Division • 1987-2026
        </div>
      </div>

      {/* How to play modal */}
      {showLore && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-red-600 rounded-lg max-w-lg w-full p-6 text-gray-200 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-700 pb-2">
              <h3 className="text-xl font-bold text-red-500 flex items-center gap-2">
                <ShieldAlert size={20} />
                SECURITY BRIEFING & SURVIVAL GUIDE
              </h3>
              <button 
                onClick={() => setShowLore(false)}
                className="text-gray-400 hover:text-white text-lg font-mono font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-sm space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <p className="text-yellow-300 font-semibold">
                Welcome to your night shift at Kattaikonam! Your job is to survive from 12:00 AM to 6:00 AM.
              </p>

              <div className="space-y-2 border-l-2 border-red-500 pl-3">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">The Three Threats:</h4>
                <p><span className="text-red-400 font-bold">1. AB:</span> Roams from the Physics Lab (CAM 1) through Corridor A into the Stairs. If he reaches your door while it's open, you're finished!</p>
                <p><span className="text-cyan-400 font-bold">2. DIPU:</span> Hides in the Supply Hallway (CAM 3). Check CAM 3 periodically to keep him suppressed. If he goes missing from CAM 3, he is sprinting straight for your office! Shut the door immediately!</p>
                <p><span className="text-yellow-400 font-bold">3. AADESH:</span> Creeps along the Stairs and into the doorway blind spot. Check your hallway light to spot him before he slips inside!</p>
              </div>

              <div className="space-y-1.5 border-l-2 border-green-500 pl-3">
                <h4 className="font-bold text-white uppercase text-xs tracking-wider">Power Management:</h4>
                <p>You have 100% power for the entire night. Leaving the door closed, light turned on, or camera open drains power exponentially faster.</p>
                <p className="text-red-400 text-xs">If power hits 0%, total blackout occurs and AB will pay you a personal visit.</p>
              </div>
            </div>

            <button
              onClick={() => setShowLore(false)}
              className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded tracking-wider uppercase text-sm"
            >
              UNDERSTOOD, COMMENCE SHIFT
            </button>
          </div>
        </div>
      )}

      {/* Custom Night AI Level Modal */}
      {showCustomNight && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border-2 border-yellow-600 rounded-lg max-w-md w-full p-6 text-gray-200 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-700 pb-2">
              <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                <Settings size={18} />
                CUSTOM NIGHT AI SETTINGS (0 - 20)
              </h3>
              <button 
                onClick={() => setShowCustomNight(false)}
                className="text-gray-400 hover:text-white font-mono"
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
                className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-red-400 font-bold border border-red-500/50 rounded"
              >
                20/20/20 MODE
              </button>
              <button
                onClick={handleCustomStart}
                className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs rounded"
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
