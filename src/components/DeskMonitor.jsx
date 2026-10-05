import React, { useState } from 'react';
import { Folder, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DeskMonitor({
  gameState,
  onOpenModal,
  className = '',
}) {
  const [showCooldownTooltip, setShowCooldownTooltip] = useState(false);

  if (!gameState) return null;

  const isBlackout = gameState.isBlackout;
  const cooldown = Math.ceil(gameState.omrCooldown || 0);
  const isReady = cooldown <= 0 && !isBlackout;

  const handleClick = (e) => {
    e.stopPropagation();
    if (isBlackout) return;

    if (cooldown > 0) {
      setShowCooldownTooltip(true);
      setTimeout(() => setShowCooldownTooltip(false), 2200);
      return;
    }

    onOpenModal();
  };

  return (
    <div
      onClick={handleClick}
      className={`relative select-none cursor-pointer group ${className}`}
      title={isReady ? 'Desk Terminal: Click to Upload OMR' : `Terminal Cooldown: ${cooldown}s remaining`}
    >
      {/* Outer Monitor Frame (monitor.webp) */}
      <img
        src="./assets/images/monitor.webp"
        alt="Security Desk Monitor"
        className="w-full h-full object-contain filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] pointer-events-none transition-transform duration-200 group-hover:scale-[1.02]"
      />

      {/* Screen Area (Positioned precisely within the monitor bezel) */}
      <div
        className={`absolute top-[7.5%] left-[10.5%] w-[79%] h-[62%] rounded-[2px] overflow-hidden flex flex-col justify-between transition-opacity duration-150 ${
          isBlackout ? 'bg-black' : 'bg-[#06141d]'
        }`}
      >
        {!isBlackout && (
          <>
            {/* Screen Scanlines and Cathode Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-transparent to-black/60 pointer-events-none z-10" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-70" />

            {/* Desktop Top Status Bar */}
            <div className="relative z-20 bg-neutral-950/80 px-1 py-0.5 border-b border-neutral-800 flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-cyan-400">
              <span className="truncate">SEC-OS // LIGIN NET</span>
              <div className="flex items-center gap-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span className="text-[6px] sm:text-[7px] text-gray-400">
                  {isReady ? 'ONLINE' : `${cooldown}s`}
                </span>
              </div>
            </div>

            {/* Center Desktop Icon: "Upload OMR?" Folder */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-1">
              <div className="relative group/folder flex flex-col items-center">
                {/* Folder & Thumbnail Container */}
                <div className="relative w-9 h-8 sm:w-11 sm:h-10 md:w-12 md:h-11 flex items-center justify-center">
                  {/* Folder Icon */}
                  <Folder
                    size={36}
                    className="text-amber-400 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] fill-amber-500/30"
                  />
                  {/* Embedded thumbnail preview from upload-confirmation.png */}
                  <div className="absolute inset-x-1.5 top-2.5 bottom-1 rounded overflow-hidden border border-amber-300/40 bg-black/60 flex items-center justify-center">
                    <img
                      src="./assets/images/upload-confirmation.png"
                      alt="Upload OMR Folder"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>
                </div>

                {/* Folder Label */}
                <span className="mt-0.5 text-[8px] sm:text-[9px] font-bold text-white font-mono bg-black/75 px-1 py-0.2 rounded border border-neutral-700 tracking-tight text-center leading-tight shadow">
                  Upload OMR?
                </span>

                {/* Status Badge */}
                <div className="mt-0.5">
                  {isReady ? (
                    <span className="text-[6px] sm:text-[7px] font-bold text-emerald-300 font-mono bg-emerald-950/80 border border-emerald-500/50 px-1 py-0.2 rounded flex items-center gap-0.5 animate-pulse">
                      <CheckCircle2 size={7} />
                      <span>READY ({gameState.omrUploadsInCycle}/{gameState.omrQuota})</span>
                    </span>
                  ) : (
                    <span className="text-[6px] sm:text-[7px] font-bold text-amber-300 font-mono bg-amber-950/80 border border-amber-500/50 px-1 py-0.2 rounded flex items-center gap-0.5">
                      <Clock size={7} />
                      <span>WAIT {cooldown}s</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Taskbar at bottom of monitor screen */}
            <div className="relative z-20 bg-neutral-950/90 px-1 py-0.5 border-t border-neutral-800 flex items-center justify-between text-[6px] sm:text-[7px] font-mono text-gray-400">
              <span className="text-emerald-400">BATCH #{gameState.omrUploadCount}</span>
              <span className="text-gray-500">{isReady ? 'CLICK TO OPEN' : 'COOLING DOWN'}</span>
            </div>
          </>
        )}
      </div>

      {/* Screen Glare & Lighting Effect on Monitor */}
      {!isBlackout && (
        <div className="absolute top-[8%] left-[11%] w-[78%] h-[30%] bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t" />
      )}

      {/* Floating Cooldown Warning Tooltip */}
      {showCooldownTooltip && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 bg-black/95 border-2 border-amber-500 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg shadow-xl flex items-center gap-1.5 whitespace-nowrap animate-bounce pointer-events-none">
          <AlertCircle size={12} className="text-amber-400" />
          <span>COOLDOWN: {cooldown}s REMAINING</span>
        </div>
      )}
    </div>
  );
}
