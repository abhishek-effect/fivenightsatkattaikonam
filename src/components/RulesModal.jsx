import React from 'react';
import { BookOpen, ShieldAlert, Zap, Lock, Lightbulb, Camera, Upload, AlertTriangle, Volume2, Maximize, X } from 'lucide-react';

export default function RulesModal({ onClose }) {
  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none animate-fadeIn"
    >
      <div className="bg-neutral-950 border-2 border-emerald-500/80 rounded-xl max-w-4xl w-full max-h-[92dvh] flex flex-col overflow-hidden text-gray-200 shadow-[0_0_50px_rgba(16,185,129,0.3)] font-mono">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border-b border-neutral-800 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-2 tracking-wider">
              <BookOpen size={17} />
              SECURITY PROTOCOL MANUAL // RULES & MECHANICS
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-neutral-800 rounded p-1 transition cursor-pointer font-bold text-sm flex items-center gap-1"
            title="Close Manual"
          >
            <X size={16} />
            <span className="text-xs">CLOSE</span>
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
                Survive from <strong className="text-white">12:00 AM to 6:00 AM</strong> (400 seconds total shift). Keep facility power above 0%. If power runs out completely, a total blackout occurs and you will be defenseless against the animatronics!
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
                    Illuminates the blind spot outside. Required AFTER closing the door to repel Aadesh!
                  </p>
                </div>

                <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded space-y-0.5">
                  <div className="flex items-center gap-1.5 text-yellow-300 font-bold">
                    <span className="text-sm">🎭</span>
                    <span>SECURITY MASK [M]</span>
                  </div>
                  <p className="text-gray-400">
                    Equips wearable mask disguise. Fools Johann when he peers through the door window!
                  </p>
                </div>

                <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded space-y-0.5">
                  <div className="flex items-center gap-1.5 text-red-400 font-bold">
                    <Volume2 size={12} />
                    <span>SCARE AUDIO [A]</span>
                  </div>
                  <p className="text-gray-400">
                    Plays teacher voice lines to scare Abhishek away to another room. 10s cooldown countdown!
                  </p>
                </div>

                <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded space-y-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Camera size={12} />
                    <span>SURVEILLANCE [SPACE]</span>
                  </div>
                  <p className="text-gray-400">
                    Opens CCTV: CAM 1 (Lab), CAM 2 & 5 (Corridors), CAM 3 (Supply), CAM 4 (Stairs), CAM 6 (Balcony).
                  </p>
                </div>

                <div className="bg-neutral-900/90 border border-neutral-800 p-2 rounded space-y-0.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Maximize size={12} />
                    <span>PANNING & QUICK GLANCE</span>
                  </div>
                  <p className="text-gray-400">
                    Move mouse (PC) or touch drag / tap DESK & DOOR buttons (mobile) to look around office.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: The Four Animatronics */}
            <div className="space-y-2 border-l-2 border-red-500 pl-3">
              <div className="flex items-center gap-1.5 text-red-400 font-bold uppercase tracking-wider text-xs">
                <AlertTriangle size={14} />
                <span>The Four Animatronic Threats</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-gray-300">
                <p className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                  <strong className="text-red-400">AB (Abhishek) [DOOR-BREAKER]:</strong> Breaks in and kills you even if the door is closed! Closing the door will NOT save you. When he approaches nearby, play Scare Audio [A] in his room to frighten him away to an adjacent room (10s cooldown). Watching his camera also freezes him in place!
                </p>
                <p className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                  <strong className="text-purple-400">Johann [WINDOW LURKER]:</strong> Appears peering through the closed door window! After 2 seconds he bangs on the door, and after 5 seconds he breaks in and kills you. Put on your Mask [M] to fool him and make him walk away!
                </p>
                <p className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                  <strong className="text-yellow-400">Aadesh [BLIND SPOT]:</strong> Sneaks through stairs into your blind spot. He only goes away if you turn on the hallway light [L] AFTER closing the blast door [D]!
                </p>
                <p className="bg-neutral-900/80 p-2 rounded border border-neutral-800">
                  <strong className="text-orange-400">Dipu [THE SPRINTER]:</strong> Lurks in CAM 3 (Supply Hall). Watch CAM 3 to stall him. If he begins sprinting down the corridor, slam the door [D] immediately before impact!
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
                Located on the office desk counter near the fan. Click or tap the monitor to upload OMR sheets to Ligin:
              </p>
              <ul className="list-disc list-inside text-[11px] text-gray-400 space-y-0.5">
                <li><strong className="text-purple-300">Hour Skips:</strong> Night 1 & 2 require 2 uploads per hour skip; Night 3 requires 3 uploads; Night 4 & 5 require 4 uploads.</li>
                <li><strong className="text-emerald-400">0% Power Drain:</strong> Uploading OMR does NOT consume any power!</li>
                <li><strong className="text-yellow-400">Cooldown:</strong> 15-second cooldown between uploads.</li>
              </ul>
            </div>

            {/* Section 5: Auxiliary Power Generator */}
            <div className="space-y-1.5 border-l-2 border-yellow-500 pl-3">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold uppercase tracking-wider text-xs">
                <Zap size={14} />
                <span>Auxiliary Power Generator (Usable from the Start)</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Located to the left of the OMR Desk Monitor (and in the top-left HUD). You can click the generator at any time from the start of your shift to match wires and ARM it. The extra <strong className="text-yellow-300">+10% to +15% power</strong> automatically activates the instant facility power reaches 0%, preventing blackout! If power has already hit 0%, wiring it activates the extra power immediately.
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
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-60" />
            </div>

            {/* Warning Card */}
            <div className="w-full bg-red-950/40 border border-red-500/60 rounded-lg p-2.5 text-center space-y-1">
              <p className="text-[11px] font-bold text-red-400 leading-tight">
                WATCH OUT FOR THIS FACE!
              </p>
              <p className="text-[10px] text-gray-300 leading-tight">
                If this appears in your doorway, closing the door won't stop him — trigger <strong className="text-yellow-300">SCARE AUDIO [A]</strong> to repel him!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
